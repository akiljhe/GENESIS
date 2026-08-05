package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"genesis-backend/config"
	"genesis-backend/database"
	"genesis-backend/models"

	"github.com/gin-gonic/gin"
)

type ImageHandler struct {
	Cfg *config.Config
}

func NewImageHandler(cfg *config.Config) *ImageHandler {
	return &ImageHandler{Cfg: cfg}
}

func (h *ImageHandler) Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File tidak ditemukan dalam request"})
		return
	}

	allowedTypes := map[string]bool{
		".png":  true,
		".jpg":  true,
		".jpeg": true,
	}
	ext := filepath.Ext(file.Filename)
	if !allowedTypes[ext] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tipe file tidak didukung. Gunakan PNG, JPG, atau JPEG"})
		return
	}

	timestamp := time.Now().UnixNano()
	filename := fmt.Sprintf("upload_%d%s", timestamp, ext)
	savePath := filepath.Join(h.Cfg.UploadsDir, filename)

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan file"})
		return
	}

	mimeType := "image/" + ext[1:]
	if ext == ".jpg" {
		mimeType = "image/jpeg"
	}

	img := models.UploadedImage{
		Filename:     filename,
		OriginalName: file.Filename,
		FilePath:     savePath,
		FileSize:     file.Size,
		MimeType:     mimeType,
	}

	if err := database.DB.Create(&img).Error; err != nil {
		os.Remove(savePath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan metadata"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Upload berhasil",
		"image":   img,
		"url":     "/static/uploads/" + filename,
	})
}

func (h *ImageHandler) List(c *gin.Context) {
	var images []models.UploadedImage
	if err := database.DB.Order("uploaded_at DESC").Find(&images).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"images": images,
		"total":  len(images),
	})
}

func (h *ImageHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	var img models.UploadedImage
	if err := database.DB.First(&img, uint(id)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gambar tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"image": img,
		"url":   "/static/uploads/" + img.Filename,
	})
}
