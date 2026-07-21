import torch
import torch.nn as nn
import torchvision.datasets as dset
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
import torchvision.utils as vutils
import os
import argparse

import csv

parser = argparse.ArgumentParser(description="Train GAN for MVTec object")
parser.add_argument("--dataset_path", type=str, default="./metal_nut", help="Path to the dataset directory")
parser.add_argument("--output_dir", type=str, default="hasil_gambar/metal_nut", help="Directory to save output images")
parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs")
args = parser.parse_args()

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

image_size = 64
batch_size = 32

transform = transforms.Compose([
    transforms.Resize(image_size),
    transforms.CenterCrop(image_size),
    transforms.Grayscale(num_output_channels=1),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

dataset_path = args.dataset_path
dataset = dset.ImageFolder(root=dataset_path, transform=transform)
dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

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

class Discriminator(nn.Module):
    def __init__(self):
        super(Discriminator, self).__init__()
        self.main = nn.Sequential(
            nn.Conv2d(1, 32, 4, 2, 1, bias=False),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(32, 64, 4, 2, 1, bias=False),
            nn.BatchNorm2d(64),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(64, 128, 4, 2, 1, bias=False),
            nn.BatchNorm2d(128),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(128, 256, 4, 2, 1, bias=False),
            nn.BatchNorm2d(256),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(256, 1, 4, 1, 0, bias=False),
            nn.Sigmoid()
        )

    def forward(self, input):
        return self.main(input)

netG = Generator().to(device)
netD = Discriminator().to(device)

criterion = nn.BCELoss()
fixed_noise = torch.randn(64, 100, 1, 1, device=device)

optimizerD = torch.optim.Adam(netD.parameters(), lr=0.0002, betas=(0.5, 0.999))
optimizerG = torch.optim.Adam(netG.parameters(), lr=0.0002, betas=(0.5, 0.999))

os.makedirs(args.output_dir, exist_ok=True)
os.makedirs("weights", exist_ok=True)
num_epochs = args.epochs

# Setup log file
dataset_name = os.path.basename(os.path.normpath(args.dataset_path))
log_file_path = os.path.join("weights", f"{dataset_name}_training_log.csv")
with open(log_file_path, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Epoch", "Batch", "Loss_D", "Loss_G"])

print(f"Training dimulai untuk {dataset_name}...")

for epoch in range(num_epochs):
    for i, data in enumerate(dataloader, 0):
        netD.zero_grad()
        real_cpu = data[0].to(device)
        b_size = real_cpu.size(0)
        label = torch.full((b_size,), 1., dtype=torch.float, device=device)
        
        output = netD(real_cpu).view(-1)
        errD_real = criterion(output, label)
        errD_real.backward()
        
        noise = torch.randn(b_size, 100, 1, 1, device=device)
        fake = netG(noise)
        label.fill_(0.)
        
        output = netD(fake.detach()).view(-1)
        errD_fake = criterion(output, label)
        errD_fake.backward()
        optimizerD.step()
        
        netG.zero_grad()
        label.fill_(1.)
        output = netD(fake).view(-1)
        errG = criterion(output, label)
        errG.backward()
        optimizerG.step()
        
        if i % 50 == 0:
            loss_d_val = errD_real.item() + errD_fake.item()
            loss_g_val = errG.item()
            print(f"[{epoch}/{num_epochs}][{i}/{len(dataloader)}] Loss_D: {loss_d_val:.4f} Loss_G: {loss_g_val:.4f}")
            with open(log_file_path, mode='a', newline='') as file:
                writer = csv.writer(file)
                writer.writerow([epoch, i, loss_d_val, loss_g_val])
            
    with torch.no_grad():
        fake = netG(fixed_noise).detach().cpu()
    vutils.save_image(fake, os.path.join(args.output_dir, f"epoch_{epoch}.png"), normalize=True)

# Simpan bobot model di akhir training
torch.save(netG.state_dict(), os.path.join("weights", f"{dataset_name}.pth"))
print(f"Bobot model disimpan di weights/{dataset_name}.pth")