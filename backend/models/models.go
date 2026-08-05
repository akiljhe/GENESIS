package models

import (
	"time"

	"gorm.io/gorm"
)

type UploadedImage struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Filename     string         `gorm:"size:255;not null" json:"filename"`
	OriginalName string         `gorm:"size:255;not null" json:"original_name"`
	FilePath     string         `gorm:"size:512;not null" json:"file_path"`
	FileSize     int64          `json:"file_size"`
	MimeType     string         `gorm:"size:100" json:"mime_type"`
	UploadedAt   time.Time      `gorm:"autoCreateTime" json:"uploaded_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

type GenerationJob struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	ModelName       string         `gorm:"size:255;not null" json:"model_name"`
	Status          string         `gorm:"size:50;not null;default:'queued'" json:"status"`
	InputImageID    *uint          `json:"input_image_id"`
	InputImage      *UploadedImage `gorm:"foreignKey:InputImageID" json:"input_image,omitempty"`
	OutputImagePath string         `gorm:"size:512" json:"output_image_path"`
	OutputImageURL  string         `gorm:"-" json:"output_image_url,omitempty"`
	ErrorMessage    string         `gorm:"size:1024" json:"error_message,omitempty"`
	CreatedAt       time.Time      `gorm:"autoCreateTime" json:"created_at"`
	CompletedAt     *time.Time     `json:"completed_at,omitempty"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}

const (
	StatusQueued     = "queued"
	StatusProcessing = "processing"
	StatusCompleted  = "completed"
	StatusFailed     = "failed"
)
