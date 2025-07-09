-- Database schema for Threat Intelligence Dashboard
-- This script creates the necessary tables for storing threat data

-- Create threats table
CREATE TABLE IF NOT EXISTS threats (
    id VARCHAR(50) PRIMARY KEY,
    original_threat_description TEXT NOT NULL,
    cleaned_threat_description TEXT NOT NULL,
    threat_category VARCHAR(100) NOT NULL,
    severity_score VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_threat_category ON threats(threat_category);
CREATE INDEX IF NOT EXISTS idx_severity_score ON threats(severity_score);
CREATE INDEX IF NOT EXISTS idx_created_at ON threats(created_at);

-- Create full-text search index for threat descriptions
CREATE FULLTEXT INDEX IF NOT EXISTS idx_threat_description 
ON threats(cleaned_threat_description, original_threat_description);

-- Create analysis_logs table for tracking ML predictions
CREATE TABLE IF NOT EXISTS analysis_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    input_description TEXT NOT NULL,
    predicted_category VARCHAR(100) NOT NULL,
    confidence_score DECIMAL(5,4) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table for authentication (if implementing user auth)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'analyst',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);
