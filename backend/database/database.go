package database

import (
	"fmt"
	"log"

	"genesis-backend/config"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Init(cfg *config.Config) {
	dsnNoDB := cfg.DBUser + ":" + cfg.DBPassword + "@tcp(" + cfg.DBHost + ":" + cfg.DBPort + ")/?charset=utf8mb4&parseTime=True&loc=Local"

	tempDB, err := gorm.Open(mysql.Open(dsnNoDB), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		log.Fatalf("Gagal connect ke MariaDB: %v", err)
	}

	createSQL := fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci", cfg.DBName)
	if err := tempDB.Exec(createSQL).Error; err != nil {
		log.Fatalf("Gagal membuat database %s: %v", cfg.DBName, err)
	}
	log.Printf("Database '%s' ready.", cfg.DBName)

	sqlDB, _ := tempDB.DB()
	sqlDB.Close()

	DB, err = gorm.Open(mysql.Open(cfg.DBDSN), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Fatalf("Gagal connect ke database %s: %v", cfg.DBName, err)
	}

	log.Println("Koneksi database berhasil.")
}

func AutoMigrate(models ...interface{}) {
	if err := DB.AutoMigrate(models...); err != nil {
		log.Fatalf("Gagal auto-migrate: %v", err)
	}
	log.Println("Database migration selesai.")
}
