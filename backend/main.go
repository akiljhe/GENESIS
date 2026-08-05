package main

import (
	"log"
	"os"

	"genesis-backend/config"
	"genesis-backend/database"
	"genesis-backend/handlers"
	"genesis-backend/models"
	"genesis-backend/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("=" + repeat("=", 49))
	log.Println("  GENESIS Backend Server")
	log.Println("=" + repeat("=", 49))

	cfg := config.Load()

	ensureDir(cfg.UploadsDir)
	ensureDir(cfg.GeneratedDir)
	ensureDir(cfg.DatasetDir)

	database.Init(cfg)
	database.AutoMigrate(&models.UploadedImage{}, &models.GenerationJob{})

	aiClient := services.NewAIClient(cfg)
	if err := aiClient.HealthCheck(); err != nil {
		log.Printf("⚠️  WARNING: %v", err)
		log.Println("   Pastikan Inference API sudah berjalan (python ai_model/api.py)")
	} else {
		log.Println("✅ Inference API terhubung.")
	}

	jobQueue := services.NewJobQueue(cfg, aiClient, 1)

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	r.Static("/static/uploads", cfg.UploadsDir)
	r.Static("/static/generated", cfg.GeneratedDir)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":       "ok",
			"service":      "genesis-backend",
			"queue_length": jobQueue.QueueLength(),
		})
	})

	api := r.Group("/api")
	{
		imgHandler := handlers.NewImageHandler(cfg)
		api.POST("/upload", imgHandler.Upload)
		api.GET("/images", imgHandler.List)
		api.GET("/images/:id", imgHandler.GetByID)

		genHandler := handlers.NewGenerateHandler(cfg, jobQueue, aiClient)
		api.POST("/generate", genHandler.CreateJob)
		api.GET("/generate", genHandler.ListJobs)
		api.GET("/generate/:id", genHandler.GetJob)
		api.GET("/models", genHandler.GetModels)
	}

	addr := ":" + cfg.ServerPort
	log.Printf("🚀 Server berjalan di http://localhost%s", addr)
	log.Printf("📁 Uploads:   %s", cfg.UploadsDir)
	log.Printf("📁 Generated: %s", cfg.GeneratedDir)
	log.Printf("📁 Dataset:   %s", cfg.DatasetDir)
	log.Printf("🤖 AI API:    %s", cfg.AIApiURL)
	log.Println(repeat("=", 50))

	if err := r.Run(addr); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}

func ensureDir(path string) {
	if err := os.MkdirAll(path, 0755); err != nil {
		log.Fatalf("Gagal membuat folder %s: %v", path, err)
	}
	log.Printf("📂 Folder ready: %s", path)
}

func repeat(s string, n int) string {
	result := ""
	for i := 0; i < n; i++ {
		result += s
	}
	return result
}
