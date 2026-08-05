import torch
import torch.nn as nn
import torchvision.utils as vutils
import os
import io
import argparse


class Generator(nn.Module):
    def __init__(self):
        super(Generator, self).__init__()
        self.main = nn.Sequential(
            nn.ConvTranspose2d(100, 256, 4, 1, 0, bias=False),
            nn.BatchNorm2d(256),
            nn.ReLU(True),
            nn.ConvTranspose2d(256, 128, 4, 2, 1, bias=False),
            nn.BatchNorm2d(128),
            nn.ReLU(True),
            nn.ConvTranspose2d(128, 64, 4, 2, 1, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU(True),
            nn.ConvTranspose2d(64, 32, 4, 2, 1, bias=False),
            nn.BatchNorm2d(32),
            nn.ReLU(True),
            nn.ConvTranspose2d(32, 1, 4, 2, 1, bias=False),
            nn.Tanh()
        )

    def forward(self, input):
        return self.main(input)


def _load_generator(model_name, weights_dir="weights"):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    weights_path = os.path.join(weights_dir, f"{model_name}.pth")

    if not os.path.exists(weights_path):
        raise FileNotFoundError(f"File weights tidak ditemukan: {weights_path}")

    netG = Generator().to(device)
    netG.load_state_dict(torch.load(weights_path, map_location=device))
    netG.eval()
    return netG, device


def generate_image(model_name, output_path, weights_dir="weights"):
    netG, device = _load_generator(model_name, weights_dir)

    noise = torch.randn(1, 100, 1, 1, device=device)
    with torch.no_grad():
        fake = netG(noise).detach().cpu()

    vutils.save_image(fake, output_path, normalize=True)
    print(f"Gambar sintesis berhasil disimpan di: {output_path}")


def generate_image_bytes(model_name, weights_dir="weights"):
    netG, device = _load_generator(model_name, weights_dir)

    noise = torch.randn(1, 100, 1, 1, device=device)
    with torch.no_grad():
        fake = netG(noise).detach().cpu()

    fake = (fake + 1) / 2.0
    fake = torch.clamp(fake, 0, 1)

    from torchvision.transforms.functional import to_pil_image
    img = to_pil_image(fake.squeeze(0))

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.getvalue()


def list_available_models(weights_dir="weights"):
    if not os.path.exists(weights_dir):
        return []
    return [f.replace(".pth", "") for f in sorted(os.listdir(weights_dir)) if f.endswith(".pth")]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Inference Script for DCGAN")
    parser.add_argument("--model", type=str, required=True, help="Nama objek (misal: metal_nut)")
    parser.add_argument("--output", type=str, default="generated_output.png", help="Path output gambar")
    args = parser.parse_args()

    generate_image(args.model, args.output)
