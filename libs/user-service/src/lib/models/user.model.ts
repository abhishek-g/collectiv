import { User, UserRole, UserStatus } from '@nx-angular-express/shared';
import { RowDataPacket } from 'mysql2';

export interface UserRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isProfileComplete: boolean;
  hasReferralCode: boolean;
  address: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  isProfileComplete?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export type UserResponse = Omit<User, 'password'>;

