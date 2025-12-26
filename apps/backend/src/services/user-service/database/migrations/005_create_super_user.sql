-- Create super user (admin)
-- Email: abhishek.goray@gmail.com
-- Password: 12345 (hashed with bcrypt)
-- This migration is idempotent - it will only insert if the user doesn't exist
INSERT IGNORE INTO users (
  id,
  name,
  email,
  password,
  role,
  status,
  isActive,
  isDeleted,
  isVerified,
  isEmailVerified,
  isProfileComplete
) VALUES (
  UUID(),
  'Super Admin',
  'abhishek.goray@gmail.com',
  '$2b$10$.mtQry7FM7MeGoIl2uBT2uS.u4zEQP8mDTw5x5L2bhsAKE5Kb8bdG',
  'admin',
  'active',
  TRUE,
  FALSE,
  TRUE,
  TRUE,
  TRUE
);

