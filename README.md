# GENESIS - Smart Manufacturing AI 🏭

GENESIS (Generative Engine for Smart Industrial Synthesis) adalah sebuah purwarupa sistem kecerdasan buatan berbasis *Generative Adversarial Network* (GAN) yang dirancang untuk mensintesis data cacat pada barang-barang manufaktur. Proyek ini bertujuan untuk mengatasi masalah kekurangan data latih cacat yang langka di industri, dengan cara membuat data sintetis (dummy) dari objek manufaktur MVTec tanpa harus merusak barang fisik yang asli.

## 📁 Struktur Repositori (Monorepo)

Repositori ini menggunakan struktur *Monorepo* yang menyatukan AI, Backend, dan Frontend dalam satu wadah untuk kemudahan kolaborasi tim:

- **`ai_model/`**: Inti dari sistem kecerdasan buatan (DCGAN). Berisi script pelatihan model (`main.py`), script inferensi/pengujian (`inference.py`), script otomatisasi (`train_all.sh`), dan direktori `weights/` untuk menampung file model `.pth` serta log pelatihan.
- **`backend/`**: (Tahap Pengembangan) Direktori untuk API Server dan integrasi logika bisnis sistem yang menjembatani model AI dan Frontend.
- **`frontend/`**: (Tahap Pengembangan) Direktori untuk antarmuka pengguna interaktif (Dashboard Inspeksi Pabrik).

## 🚀 Fitur Utama AI Model
- **Arsitektur DCGAN**: Menggunakan Deep Convolutional GAN dengan Generator dan Discriminator untuk mensintesis gambar skala abu-abu (grayscale) dengan resolusi tinggi (64x64).
- **Inference Ready**: Sudah disediakan file `inference.py` untuk di-load langsung oleh tim backend dengan argument CLI yang mudah (contoh: `--model metal_nut`).
- **Otomatisasi Pelatihan**: Pelatihan dapat dijalankan sekaligus untuk banyak objek industri dengan memanfaatkan `train_all.sh`.
- **Sistem Log**: Setiap proses training akan mencatat parameter Loss (D & G) ke dalam bentuk file `.csv` per objek (contoh: `metal_nut_training_log.csv`).

## 🛠 Instalasi dan Penggunaan (AI Model)

### Prasyarat
- Python 3.8+
- PyTorch & Torchvision
- Streamlit (Untuk testing UI awal)

### 1. Proses Training (Melatih Model)
Jika Anda ingin melatih ulang (retrain) model AI dengan data yang ada, jalankan perintah berikut dari folder root:
```bash
cd ai_model
python main.py --dataset_path ../<nama_folder_objek> --output_dir ../hasil_gambar/<nama_objek> --epochs 50
```
Atau jalankan skrip bash untuk melatih semuanya secara berurutan:
```bash
./train_all.sh
```
*Catatan: Bobot akhir (`.pth`) dan log akan otomatis tersimpan di folder `ai_model/weights/`.*

### 2. Inferensi (Membuat Gambar Baru)
Tim backend dapat dengan mudah mencetak gambar sintetis cacat baru dengan memanggil script ini:
```bash
cd ai_model
python inference.py --model metal_nut --output generated_metal_nut.png
```

---
*Proyek ini merupakan kolaborasi dalam tim untuk kompetisi AIC (AI Innovation Challenge).*
