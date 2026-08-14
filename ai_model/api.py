from flask import Flask, request, jsonify, send_file
import io
import os
from inference import generate_image_bytes, generate_image, list_available_models

app = Flask(__name__)

WEIGHTS_DIR = os.path.join(os.path.dirname(__file__), "weights")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "genesis-inference-api"})


@app.route("/models", methods=["GET"])
def get_models():
    models = list_available_models(weights_dir=WEIGHTS_DIR)
    return jsonify({"models": models})


@app.route("/inference", methods=["POST"])
def inference():
    data = request.get_json()
    if not data or "model_name" not in data:
        return jsonify({"error": "model_name is required"}), 400

    model_name = data["model_name"]
    save_path = data.get("save_path", None)

    available = list_available_models(weights_dir=WEIGHTS_DIR)
    if model_name not in available:
        return jsonify({
            "error": f"Model '{model_name}' tidak ditemukan",
            "available_models": available
        }), 404

    try:
        if save_path:
            os.makedirs(os.path.dirname(save_path), exist_ok=True) if os.path.dirname(save_path) else None
            generate_image(model_name, save_path, weights_dir=WEIGHTS_DIR)
            return send_file(save_path, mimetype="image/png")
        else:
            img_bytes = generate_image_bytes(model_name, weights_dir=WEIGHTS_DIR)
            return send_file(
                io.BytesIO(img_bytes),
                mimetype="image/png",
                as_attachment=False,
                download_name=f"{model_name}_generated.png"
            )
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Inference gagal: {str(e)}"}), 500


if __name__ == "__main__":
    print("=" * 50)
    print("GENESIS Inference API Server")
    print(f"Weights directory: {WEIGHTS_DIR}")
    print(f"Available models: {list_available_models(weights_dir=WEIGHTS_DIR)}")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=False, threaded=True)
