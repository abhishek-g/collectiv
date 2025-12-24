-- Create sessions table for tracking user sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  userId VARCHAR(36) NOT NULL,
  token VARCHAR(500) NOT NULL,
  refreshToken VARCHAR(500),
  ipAddress VARCHAR(45),
  userAgent TEXT,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isActive BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_token (token),
  INDEX idx_expiresAt (expiresAt),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

