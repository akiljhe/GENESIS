#!/bin/bash

# Array of datasets to train (excluding metal_nut and casting_512x512 which are already done/training)
DATASETS=(
    "capsule"
    "carpet"
    "grid"
    "hazelnut"
    "leather"
    "pill"
    "screw"
    "tile"
    "toothbrush"
    "transistor"
    "wood"
    "zipper"
)

echo "Memulai proses training untuk semua objek..."

for dataset in "${DATASETS[@]}"; do
    echo "========================================"
    echo "Training model untuk objek: $dataset"
    echo "========================================"
    
    # Define dataset path and output directory
    dataset_path="./$dataset"
    output_dir="./hasil_gambar/$dataset"
    
    # Run the training script
    python main.py --dataset_path "$dataset_path" --output_dir "$output_dir"
    
    echo "Selesai training objek: $dataset"
done

echo "Semua objek selesai di-training!"
