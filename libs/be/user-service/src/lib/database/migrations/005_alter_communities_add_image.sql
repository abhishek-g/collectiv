-- Add optional image URL to communities
ALTER TABLE communities
  ADD COLUMN image_url VARCHAR(500) NULL AFTER description;

