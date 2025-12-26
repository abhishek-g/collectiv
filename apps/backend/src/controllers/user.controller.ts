import { Request, Response } from 'express';
import { userService, CreateUserDto, UpdateUserDto, LoginDto } from '../services/user-service';
import { HttpResponse, PaginatedHttpResponse } from '../types';

export class UserController {
  /**
   * Create a new user
   * POST /api/users
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;
      
      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        const response: HttpResponse<null> = {
          success: false,
          error: 'Name, email, and password are required',
          statusCode: 400,
        };
        res.status(400).json(response);
        return;
      }

      const user = await userService.createUser(userData);

      const response: HttpResponse<typeof user> = {
        success: true,
        data: user,
        message: 'User created successfully',
        statusCode: 201,
      };

      res.status(201).json(response);
    } catch (error: unknown) {
      let errorMessage = 'Failed to create user';
      let statusCode = 400;

      if (error instanceof Error) {
        errorMessage = error.message;
        // Check for duplicate email (MySQL error code 1062)
        if (error.message.includes('Duplicate entry') || error.message.includes('ER_DUP_ENTRY')) {
          errorMessage = 'Email already exists';
          statusCode = 409;
        }
      }

      const response: HttpResponse<null> = {
        success: false,
        error: errorMessage,
        statusCode,
      };
      res.status(statusCode).json(response);
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      const response: HttpResponse<null> = {
        success: false,
        error: errorMessage,
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive user';
      const response: HttpResponse<null> = {
        success: false,
        error: errorMessage,
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to list users';
      const response: HttpResponse<null> = {
        success: false,
        error: errorMessage,
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
      
      // Validate input
      if (!loginData.email || !loginData.password) {
        const response: HttpResponse<null> = {
          success: false,
          error: 'Email and password are required',
          statusCode: 400,
        };
        res.status(400).json(response);
        return;
      }

      const result = await userService.login(loginData);

      const response: HttpResponse<typeof result> = {
        success: true,
        data: result,
        message: 'Login successful',
        statusCode: 200,
      };

      res.status(200).json(response);
    } catch (error: unknown) {
      // Extract meaningful error message
      let errorMessage = 'Login failed';
      let statusCode = 401;

      if (error instanceof Error) {
        errorMessage = error.message;
        // Check for specific error types
        if (error.message.includes('Invalid email or password')) {
          statusCode = 401;
        } else if (error.message.includes('not active') || error.message.includes('archived')) {
          statusCode = 403;
        } else if (error.message.includes('not found')) {
          statusCode = 404;
        }
      }

      const response: HttpResponse<null> = {
        success: false,
        error: errorMessage,
        statusCode,
      };
      res.status(statusCode).json(response);
    }
  }

  /**
   * Get user profile
   * GET /api/users/profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract userId from JWT token in middleware
      interface RequestWithUserId extends Request {
        userId?: string;
      }
      const userId = (req as RequestWithUserId).userId || req.params.id;

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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get profile';
      const response: HttpResponse<null> = {
        success: false,
        error: errorMessage,
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Signout failed';
      const response: HttpResponse<null> = {
        success: false,
        error: errorMessage,
        statusCode: 500,
      };
      res.status(500).json(response);
    }
  }
}

export default new UserController();

