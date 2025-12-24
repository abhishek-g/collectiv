-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  status ENUM('active', 'inactive') DEFAULT 'active',
  isActive BOOLEAN DEFAULT TRUE,
  isDeleted BOOLEAN DEFAULT FALSE,
  isVerified BOOLEAN DEFAULT FALSE,
  isEmailVerified BOOLEAN DEFAULT FALSE,
  isPhoneVerified BOOLEAN DEFAULT FALSE,
  isProfileComplete BOOLEAN DEFAULT FALSE,
  hasReferralCode BOOLEAN DEFAULT FALSE,
  address VARCHAR(500),
  phone VARCHAR(20),
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_isDeleted (isDeleted),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

