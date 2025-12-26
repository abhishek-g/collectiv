import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role?: string;
  };
  file?: Express.Multer.File;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Authorization token missing',
      statusCode: 401,
    });
    return;
  }

  try {
    const secret = process.env['JWT_SECRET'] || 'your-secret-key-change-this-in-production';
    const payload = jwt.verify(token, secret) as { userId?: string; role?: string };
    if (!payload.userId) {
      throw new Error('Invalid token payload');
    }
    (req as AuthenticatedRequest).user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      statusCode: 401,
    });
  }
}

