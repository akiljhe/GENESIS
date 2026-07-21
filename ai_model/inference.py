import torch
import torch.nn as nn
import torchvision.utils as vutils
import os
import argparse

# Definisikan arsitektur Generator agar sama dengan main.py
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

def generate_image(model_name, output_path):
    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
    weights_path = os.path.join("weights", f"{model_name}.pth")
    
    if not os.path.exists(weights_path):
        raise FileNotFoundError(f"File weights tidak ditemukan: {weights_path}")

    # Load Model
    netG = Generator().to(device)
    netG.load_state_dict(torch.load(weights_path, map_location=device))
    netG.eval()

    # Generate Image
    noise = torch.randn(1, 100, 1, 1, device=device)
    with torch.no_grad():
        fake = netG(noise).detach().cpu()
    
    vutils.save_image(fake, output_path, normalize=True)
    print(f"Gambar sintesis berhasil disimpan di: {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Inference Script for DCGAN")
    parser.add_argument("--model", type=str, required=True, help="Nama objek (misal: metal_nut)")
    parser.add_argument("--output", type=str, default="generated_output.png", help="Path output gambar")
    args = parser.parse_args()
    
    generate_image(args.model, args.output)
