package services

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"genesis-backend/config"
)

type AIClient struct {
	BaseURL string
	Client  *http.Client
}

func NewAIClient(cfg *config.Config) *AIClient {
	return &AIClient{
		BaseURL: cfg.AIApiURL,
		Client: &http.Client{
			Timeout: 120 * time.Second,
		},
	}
}

func (c *AIClient) HealthCheck() error {
	resp, err := c.Client.Get(c.BaseURL + "/health")
	if err != nil {
		return fmt.Errorf("inference API tidak bisa dijangkau: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("inference API health check gagal: status %d", resp.StatusCode)
	}
	return nil
}

func (c *AIClient) ListModels() ([]string, error) {
	resp, err := c.Client.Get(c.BaseURL + "/models")
	if err != nil {
		return nil, fmt.Errorf("gagal mengambil list models: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	bodyStr := string(body)
	_ = bodyStr
	return nil, fmt.Errorf("use GetModelsRaw instead or parse JSON properly")
}

func (c *AIClient) GetModelsRaw() ([]byte, error) {
	resp, err := c.Client.Get(c.BaseURL + "/models")
	if err != nil {
		return nil, fmt.Errorf("gagal mengambil list models: %w", err)
	}
	defer resp.Body.Close()
	return io.ReadAll(resp.Body)
}

func (c *AIClient) GenerateImage(modelName string, outputPath string) error {
	payload := fmt.Sprintf(`{"model_name": "%s"}`, modelName)
	resp, err := c.Client.Post(
		c.BaseURL+"/inference",
		"application/json",
		strings.NewReader(payload),
	)
	if err != nil {
		return fmt.Errorf("gagal memanggil inference API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("inference API error (status %d): %s", resp.StatusCode, string(body))
	}

	outFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("gagal membuat file output: %w", err)
	}
	defer outFile.Close()

	written, err := io.Copy(outFile, resp.Body)
	if err != nil {
		return fmt.Errorf("gagal menulis file output: %w", err)
	}

	log.Printf("Gambar berhasil disimpan: %s (%d bytes)", outputPath, written)
	return nil
}
