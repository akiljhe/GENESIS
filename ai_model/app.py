import streamlit as st
from PIL import Image
import os

st.set_page_config(page_title="Dashboard Inspeksi Pabrik", page_icon="🏭", layout="wide")

folder_gambar_base = "hasil_gambar"

with st.sidebar:
    st.header("⚙️ Kontrol Panel AI")
    st.write("Atur parameter sintesis data di bawah ini.")
    
    epoch_pilihan = st.slider(
        "Fase Pembelajaran (Epoch):", 
        min_value=0, 
        max_value=49, 
        value=49
    )
    
    st.divider()
    st.write("📊 **Status Sistem:**")
    st.success("DCGAN Model: Active")
    
    objek_pilihan = None
    if os.path.exists(folder_gambar_base):
        subdirs = sorted([d for d in os.listdir(folder_gambar_base) if os.path.isdir(os.path.join(folder_gambar_base, d))])
        if subdirs:
            objek_pilihan = st.selectbox("Dataset Mode:", subdirs)
        else:
            st.info("Dataset Mode: Belum ada data")
    else:
        st.error("Folder 'hasil_gambar' tidak ditemukan.")

st.title("🏭 AI-Powered Defect Synthesis")
st.markdown("Prototipe *Generative Adversarial Network* (GAN) untuk memproduksi variasi data gambar cacat pada material industri tanpa harus merusak barang fisik.")
st.divider()

kolom_kiri, kolom_kanan = st.columns(2)

with kolom_kiri:
    st.subheader("📷 Data Asli (Ground Truth)")
    st.write("Unggah contoh gambar barang dari pabrik sebagai perbandingan.")
    
    gambar_user = st.file_uploader("Pilih file gambar...", type=['png', 'jpg', 'jpeg'])
    
    if gambar_user is not None:
        img_asli = Image.open(gambar_user)
        st.image(img_asli, caption="Gambar Referensi dari Pengguna", use_container_width=True)
    else:
        st.info("Silakan unggah gambar referensi jika ada.")

with kolom_kanan:
    st.subheader("🤖 Data Sintesis (AI Generated)")
    st.write("Hasil gambar yang diciptakan oleh model Generator.")
    
    if objek_pilihan:
        folder_gambar = os.path.join(folder_gambar_base, objek_pilihan)
        nama_file = f"epoch_{epoch_pilihan}.png"
        path_gambar = os.path.join(folder_gambar, nama_file)

        if os.path.exists(path_gambar):
            gambar_ai = Image.open(path_gambar)
            st.image(gambar_ai, caption=f"Hasil Generate AI {objek_pilihan} di Epoch {epoch_pilihan}", use_container_width=True)
        else:
            st.warning(f"Gambar untuk putaran ke-{epoch_pilihan} tidak ditemukan di folder {folder_gambar}.")
    else:
        st.warning("Pilih objek di sidebar terlebih dahulu.")

st.divider()
st.caption("Dikembangkan untuk AI Innovation Challenge | Arsitektur: Deep Convolutional GAN (DCGAN)")