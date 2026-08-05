package services

import (
	"fmt"
	"log"
	"path/filepath"
	"time"

	"genesis-backend/config"
	"genesis-backend/database"
	"genesis-backend/models"
)

type JobQueue struct {
	queue    chan uint
	aiClient *AIClient
	cfg      *config.Config
}

func NewJobQueue(cfg *config.Config, aiClient *AIClient, workerCount int) *JobQueue {
	jq := &JobQueue{
		queue:    make(chan uint, 100),
		aiClient: aiClient,
		cfg:      cfg,
	}

	for i := 0; i < workerCount; i++ {
		go jq.worker(i)
	}
	log.Printf("Job queue dimulai dengan %d worker(s).", workerCount)

	return jq
}

func (jq *JobQueue) Enqueue(jobID uint) {
	jq.queue <- jobID
	log.Printf("Job #%d masuk antrian.", jobID)
}

func (jq *JobQueue) QueueLength() int {
	return len(jq.queue)
}

func (jq *JobQueue) worker(id int) {
	log.Printf("Worker-%d siap.", id)
	for jobID := range jq.queue {
		jq.processJob(id, jobID)
	}
}

func (jq *JobQueue) processJob(workerID int, jobID uint) {
	log.Printf("Worker-%d memproses Job #%d...", workerID, jobID)

	var job models.GenerationJob
	if err := database.DB.First(&job, jobID).Error; err != nil {
		log.Printf("Worker-%d: Job #%d tidak ditemukan di DB: %v", workerID, jobID, err)
		return
	}

	database.DB.Model(&job).Update("status", models.StatusProcessing)

	outputFilename := fmt.Sprintf("gen_%d_%s_%d.png", job.ID, job.ModelName, time.Now().Unix())
	outputPath := filepath.Join(jq.cfg.GeneratedDir, outputFilename)

	err := jq.aiClient.GenerateImage(job.ModelName, outputPath)
	if err != nil {
		log.Printf("Worker-%d: Job #%d gagal: %v", workerID, jobID, err)
		now := time.Now()
		database.DB.Model(&job).Updates(map[string]interface{}{
			"status":        models.StatusFailed,
			"error_message": err.Error(),
			"completed_at":  &now,
		})
		return
	}

	now := time.Now()
	database.DB.Model(&job).Updates(map[string]interface{}{
		"status":            models.StatusCompleted,
		"output_image_path": outputFilename,
		"completed_at":      &now,
	})

	log.Printf("Worker-%d: Job #%d selesai → %s", workerID, jobID, outputFilename)
}
