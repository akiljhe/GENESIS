package handlers

import (
	"net/http"
	"os"
	"strconv"
	"strings"

	"genesis-backend/config"
	"genesis-backend/database"
	"genesis-backend/models"
	"genesis-backend/services"

	"github.com/gin-gonic/gin"
)

type GenerateHandler struct {
	Cfg      *config.Config
	Queue    *services.JobQueue
	AIClient *services.AIClient
}

func NewGenerateHandler(cfg *config.Config, queue *services.JobQueue, aiClient *services.AIClient) *GenerateHandler {
	return &GenerateHandler{
		Cfg:      cfg,
		Queue:    queue,
		AIClient: aiClient,
	}
}

func (h *GenerateHandler) CreateJob(c *gin.Context) {
	var req struct {
		ModelName    string `json:"model_name" binding:"required"`
		InputImageID *uint  `json:"input_image_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "model_name wajib diisi"})
		return
	}

	job := models.GenerationJob{
		ModelName:    req.ModelName,
		Status:       models.StatusQueued,
		InputImageID: req.InputImageID,
	}

	if err := database.DB.Create(&job).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat job"})
		return
	}

	h.Queue.Enqueue(job.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message":      "Job berhasil dibuat dan masuk antrian",
		"job":          job,
		"queue_length": h.Queue.QueueLength(),
	})
}

func (h *GenerateHandler) GetJob(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	var job models.GenerationJob
	if err := database.DB.Preload("InputImage").First(&job, uint(id)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Job tidak ditemukan"})
		return
	}

	if job.Status == models.StatusCompleted && job.OutputImagePath != "" {
		job.OutputImageURL = "/static/generated/" + job.OutputImagePath
	}

	c.JSON(http.StatusOK, gin.H{"job": job})
}

func (h *GenerateHandler) ListJobs(c *gin.Context) {
	var jobs []models.GenerationJob

	query := database.DB.Order("created_at DESC")
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Find(&jobs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data jobs"})
		return
	}

	for i := range jobs {
		if jobs[i].Status == models.StatusCompleted && jobs[i].OutputImagePath != "" {
			jobs[i].OutputImageURL = "/static/generated/" + jobs[i].OutputImagePath
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"jobs":  jobs,
		"total": len(jobs),
	})
}

func (h *GenerateHandler) GetModels(c *gin.Context) {
	weightsDir := h.Cfg.WeightsDir

	entries, err := os.ReadDir(weightsDir)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Gagal membaca folder weights",
			"details": err.Error(),
		})
		return
	}

	var modelList []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".pth") {
			name := strings.TrimSuffix(entry.Name(), ".pth")
			modelList = append(modelList, name)
		}
	}

	c.JSON(http.StatusOK, gin.H{"models": modelList})
}
