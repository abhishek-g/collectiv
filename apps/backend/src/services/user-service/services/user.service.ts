import pool from '../config/database';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';
import { UserRow, CreateUserDto, UpdateUserDto, LoginDto, UserResponse, LoginUserInfo } from '../models/user.model';
import { UserRole, UserStatus } from '../../../../../../libs/shared/src/index';

export class UserService {
  /**
   * Create a new user
   */
  async createUser(userData: CreateUserDto): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userId = this.generateUUID();

    await pool.execute<UserRow[]>(
      `INSERT INTO users (
        id, name, email, password, role, status, phone, address, city, state, zip, country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        userData.name,
        userData.email,
        hashedPassword,
        userData.role || UserRole.USER,
        UserStatus.ACTIVE,
        userData.phone || null,
        userData.address || null,
        userData.city || null,
        userData.state || null,
        userData.zip || null,
        userData.country || null,
      ]
    );

    return this.getUserById(userId);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserResponse> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE id = ? AND isDeleted = FALSE',
      [id]
    );

    if (rows.length === 0) {
      throw new Error('User not found');
    }

    return this.mapToUserResponse(rows[0]);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserRow | null> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE email = ? AND isDeleted = FALSE',
      [email]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Update user
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<UserResponse> {
    const updates: string[] = [];
    const values: (string | boolean | null)[] = [];

    if (userData.name) {
      updates.push('name = ?');
      values.push(userData.name);
    }
    if (userData.email) {
      updates.push('email = ?');
      values.push(userData.email);
    }
    if (userData.phone !== undefined) {
      updates.push('phone = ?');
      values.push(userData.phone || null);
    }
    if (userData.address !== undefined) {
      updates.push('address = ?');
      values.push(userData.address || null);
    }
    if (userData.city !== undefined) {
      updates.push('city = ?');
      values.push(userData.city || null);
    }
    if (userData.state !== undefined) {
      updates.push('state = ?');
      values.push(userData.state || null);
    }
    if (userData.zip !== undefined) {
      updates.push('zip = ?');
      values.push(userData.zip || null);
    }
    if (userData.country !== undefined) {
      updates.push('country = ?');
      values.push(userData.country || null);
    }
    if (userData.isProfileComplete !== undefined) {
      updates.push('isProfileComplete = ?');
      values.push(userData.isProfileComplete);
    }

    if (updates.length === 0) {
      return this.getUserById(id);
    }

    values.push(id);

    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ? AND isDeleted = FALSE`,
      values
    );

    return this.getUserById(id);
  }

  /**
   * Archive user (soft delete)
   */
  async archiveUser(id: string): Promise<void> {
    await pool.execute(
      'UPDATE users SET isDeleted = TRUE, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [UserStatus.INACTIVE, id]
    );
  }

  /**
   * List users with pagination
   */
  async listUsers(page = 1, limit = 10): Promise<{
    users: UserResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM users WHERE isDeleted = FALSE'
    );
    const total = (countResult[0] as { total: number })?.total || 0;

    // Get users
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE isDeleted = FALSE ORDER BY createdAt DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    return {
      users: rows.map((row: UserRow) => this.mapToUserResponse(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Login user
   */
  async login(loginData: LoginDto): Promise<{ user: LoginUserInfo; token: string }> {
    const user = await this.getUserByEmail(loginData.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.isDeleted) {
      throw new Error('User account has been archived');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new Error('User account is not active');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Return minimal user info for security (only id, role, status)
    return {
      user: {
        id: user.id,
        role: user.role,
        status: user.status,
      },
      token,
    };
  }

  /**
   * Get user profile (by ID)
   */
  async getProfile(userId: string): Promise<UserResponse> {
    return this.getUserById(userId);
  }

  /**
   * Map database row to user response (without password)
   */
  private mapToUserResponse(row: UserRow): UserResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = row;
    return userResponse as UserResponse;
  }

  /**
   * Generate UUID
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: string): string {
    const secret = process.env['JWT_SECRET'] || 'your-secret-key-change-this-in-production';
    const expiresIn = process.env['JWT_EXPIRES_IN'] || '7d';
    return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
  }
}

export default new UserService();

