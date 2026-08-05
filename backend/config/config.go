package config

import "os"

type Config struct {
	DBUser     string
	DBPassword string
	DBHost     string
	DBPort     string
	DBName     string
	DBDSN      string

	AIApiURL   string
	WeightsDir string

	UploadsDir   string
	GeneratedDir string
	DatasetDir   string

	ServerPort string
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func Load() *Config {
	user := getEnv("DB_USER", "root")
	pass := getEnv("DB_PASSWORD", "")
	host := getEnv("DB_HOST", "127.0.0.1")
	port := getEnv("DB_PORT", "3306")
	name := getEnv("DB_NAME", "genesis_db")

	dsn := user + ":" + pass + "@tcp(" + host + ":" + port + ")/" + name + "?charset=utf8mb4&parseTime=True&loc=Local"

	return &Config{
		DBUser:     user,
		DBPassword: pass,
		DBHost:     host,
		DBPort:     port,
		DBName:     name,
		DBDSN:      dsn,

		AIApiURL:   getEnv("AI_API_URL", "http://127.0.0.1:5000"),
		WeightsDir: getEnv("WEIGHTS_DIR", "../ai_model/weights"),

		UploadsDir:   getEnv("UPLOADS_DIR", "images/uploads"),
		GeneratedDir: getEnv("GENERATED_DIR", "images/generated"),
		DatasetDir:   getEnv("DATASET_DIR", "images/dataset"),

		ServerPort: getEnv("SERVER_PORT", "8000"),
	}
}
