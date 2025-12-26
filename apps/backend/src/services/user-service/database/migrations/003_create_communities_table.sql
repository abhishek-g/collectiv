-- Communities table
CREATE TABLE IF NOT EXISTS communities (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  image_url VARCHAR(500) NULL,
  visibility ENUM('public', 'private') NOT NULL DEFAULT 'public',
  owner_id VARCHAR(36) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_communities_owner (owner_id),
  CONSTRAINT fk_communities_owner FOREIGN KEY (owner_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

