export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
  status: UserStatus;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isProfileComplete: boolean;
  hasReferralCode: boolean;
  address: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};


export interface UserReferral {
  id: string;
  userId: string;
  referralCode: string;
  referralAmount: number;
  referralDate: Date;
};

// User response type (User without password)
export type UserResponse = Omit<User, 'password'>;

// Minimal user info for login response
export interface LoginUserInfo {
  id: string;
  role: UserRole;
  status: UserStatus;
}
