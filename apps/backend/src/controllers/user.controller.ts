import { Request, Response } from 'express';
import userService from '../services/user.service';
import { CreateUserDto, UpdateUserDto, LoginDto } from '../models/user.model';
import { HttpResponse, PaginatedHttpResponse } from '@nx-angular-express/shared';

export class UserController {
  /**
   * Create a new user
   * POST /api/users
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;
      const user = await userService.createUser(userData);

      const response: HttpResponse<typeof user> = {
        success: true,
        data: user,
        message: 'User created successfully',
        statusCode: 201,
      };

      res.status(201).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error.message || 'Failed to create user',
        statusCode: 400,
      };
      res.status(400).json(response);
    }
  }

  /**
   * Update user
   * PUT /api/users/:id
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userData: UpdateUserDto = req.body;
      const user = await userService.updateUser(id, userData);

      const response: HttpResponse<typeof user> = {
        success: true,
        data: user,
        message: 'User updated successfully',
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error.message || 'Failed to update user',
        statusCode: 400,
      };
      res.status(400).json(response);
    }
  }

  /**
   * Archive user (soft delete)
   * DELETE /api/users/:id
   */
  async archiveUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await userService.archiveUser(id);

      const response: HttpResponse<null> = {
        success: true,
        message: 'User archived successfully',
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error.message || 'Failed to archive user',
        statusCode: 400,
      };
      res.status(400).json(response);
    }
  }

  /**
   * List users with pagination
   * GET /api/users
   */
  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await userService.listUsers(page, limit);

      const response: PaginatedHttpResponse<typeof result.users[0]> = {
        success: true,
        items: result.users,
        total: result.total,
        page: result.page,
        limit: result.limit,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error.message || 'Failed to list users',
        statusCode: 500,
      };
      res.status(500).json(response);
    }
  }

  /**
   * Login user
   * POST /api/users/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginDto = req.body;
      const result = await userService.login(loginData);

      const response: HttpResponse<typeof result> = {
        success: true,
        data: result,
        message: 'Login successful',
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error.message || 'Login failed',
        statusCode: 401,
      };
      res.status(401).json(response);
    }
  }

  /**
   * Get user profile
   * GET /api/users/profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract userId from JWT token in middleware
      const userId = (req as any).userId || req.params.id;

      if (!userId) {
        const response: HttpResponse<null> = {
          success: false,
          error: 'User ID required',
          statusCode: 400,
        };
        res.status(400).json(response);
        return;
      }

      const user = await userService.getProfile(userId);

      const response: HttpResponse<typeof user> = {
        success: true,
        data: user,
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error.message || 'Failed to get profile',
        statusCode: 404,
      };
      res.status(404).json(response);
    }
  }

  /**
   * Signout user (logout)
   * POST /api/users/signout
   */
  async signout(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Invalidate JWT token/session
      const response: HttpResponse<null> = {
        success: true,
        message: 'Signed out successfully',
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: HttpResponse<null> = {
        success: false,
        error: error.message || 'Signout failed',
        statusCode: 500,
      };
      res.status(500).json(response);
    }
  }
}

export default new UserController();

