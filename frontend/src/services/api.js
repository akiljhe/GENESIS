const API_BASE_URL = 'http://localhost:5000';

export const fetchModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/models`);
    const data = await response.json();
    return data.models;
  } catch (error) {
    console.error("Gagal mengambil model:", error);
    return [];
  }
};

export const generateInference = async (modelName, savePath = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_name: modelName,
        save_path: savePath,
      }),
    });

    if (!response.ok) throw new Error("Inference gagal");
    
    const imageBlob = await response.blob();
    return URL.createObjectURL(imageBlob);
  } catch (error) {
    console.error("Error inference:", error);
    throw error;
  }
};