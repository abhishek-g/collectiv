-- Community members table
CREATE TABLE IF NOT EXISTS community_members (
  community_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  role ENUM('owner', 'admin', 'member') NOT NULL DEFAULT 'member',
  nickname VARCHAR(100) NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (community_id, user_id),
  INDEX idx_cm_user (user_id),
  CONSTRAINT fk_cm_community FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
  CONSTRAINT fk_cm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

