# GENESIS - Smart Manufacturing AI 🏭

GENESIS (Generative Engine for Smart Industrial Synthesis) adalah sebuah purwarupa sistem kecerdasan buatan berbasis *Generative Adversarial Network* (GAN) yang dirancang untuk mensintesis data cacat pada barang-barang manufaktur. Proyek ini bertujuan untuk mengatasi masalah kekurangan data latih cacat yang langka di industri, dengan cara membuat data sintetis (dummy) dari objek manufaktur MVTec tanpa harus merusak barang fisik yang asli.

## 📁 Struktur Repositori (Monorepo)

Repositori ini menggunakan struktur *Monorepo* yang menyatukan AI, Backend, dan Frontend dalam satu wadah untuk kemudahan kolaborasi tim:

- **`ai_model/`**: Inti dari sistem kecerdasan buatan (DCGAN). Berisi script pelatihan model (`main.py`), script inferensi/pengujian (`inference.py`), Flask inference API (`api.py`), dashboard Streamlit (`app.py`), dan direktori `weights/` untuk file model `.pth`.
- **`backend/`**: API Server berbasis Go (Gin + GORM) yang menjembatani model AI dan Frontend. Menangani upload gambar, job queue, dan komunikasi dengan Inference API.
- **`frontend/`**: (Tahap Pengembangan) Direktori untuk antarmuka pengguna interaktif (Dashboard Inspeksi Pabrik).

## 🚀 Fitur Utama AI Model
- **Arsitektur DCGAN**: Menggunakan Deep Convolutional GAN dengan Generator dan Discriminator untuk mensintesis gambar skala abu-abu (grayscale) dengan resolusi tinggi (64x64).
- **Inference Ready**: Sudah disediakan file `inference.py` untuk di-load langsung oleh tim backend dengan argument CLI yang mudah (contoh: `--model metal_nut`).
- **Otomatisasi Pelatihan**: Pelatihan dapat dijalankan sekaligus untuk banyak objek industri dengan memanfaatkan `train_all.sh`.
- **Sistem Log**: Setiap proses training akan mencatat parameter Loss (D & G) ke dalam bentuk file `.csv` per objek (contoh: `metal_nut_training_log.csv`).

## ⚙️ Backend

### Arsitektur

```
Streamlit (8501) → Go Backend (8000) → Python Inference API (5000)
                        ↕
                   MariaDB (3306)
```

### Tech Stack
- **Go** (Gin framework + GORM ORM)
- **MariaDB** (XAMPP, port 3306)
- **Flask** (Inference API wrapper untuk PyTorch)

### Struktur Backend

| File | Deskripsi |
|------|-----------|
| `main.go` | Entry point, routing, static file serving |
| `config/config.go` | Konfigurasi dari environment variables |
| `database/database.go` | Koneksi MariaDB + auto-create database |
| `models/models.go` | Schema `UploadedImage` dan `GenerationJob` |
| `handlers/images.go` | Endpoint upload dan manajemen gambar |
| `handlers/generate.go` | Endpoint generate dan list model |
| `services/queue.go` | Job queue dengan goroutine worker |
| `services/ai_client.go` | HTTP client ke Python Inference API |

### API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/health` | Health check |
| `POST` | `/api/upload` | Upload gambar |
| `GET` | `/api/images` | List gambar |
| `GET` | `/api/images/:id` | Detail gambar |
| `POST` | `/api/generate` | Buat job generate |
| `GET` | `/api/generate` | List jobs |
| `GET` | `/api/generate/:id` | Status job |
| `GET` | `/api/models` | List model tersedia |

## 🛠 Instalasi dan Penggunaan

### Prasyarat
- Python 3.8+
- PyTorch & Torchvision
- Flask
- Go 1.21+
- MariaDB / XAMPP (port 3306)
- Streamlit

### Menjalankan Sistem (3 Terminal)

```bash
# Terminal 1: Inference API
cd ai_model
py api.py

# Terminal 2: Go Backend
cd backend
go run main.go

# Terminal 3: Streamlit Dashboard
cd ai_model
streamlit run app.py
```

> **Penting**: Jalankan sesuai urutan di atas. Pastikan XAMPP MariaDB aktif sebelum memulai.

### Training Model
```bash
cd ai_model
python main.py --dataset_path ../<nama_folder_objek> --output_dir ../hasil_gambar/<nama_objek> --epochs 50
```
Atau jalankan semua sekaligus:
```bash
./train_all.sh
```

### Inferensi CLI
```bash
cd ai_model
python inference.py --model metal_nut --output generated_metal_nut.png
```

---
*Proyek ini merupakan kolaborasi dalam tim untuk kompetisi AIC (AI Innovation Challenge).*
