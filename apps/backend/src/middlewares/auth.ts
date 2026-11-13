import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../db.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    user_metadata?: Record<string, any>;
  };
  token?: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or malformed Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired authentication token' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    };
    req.token = token;
    next();
  } catch (err: any) {
    res.status(500).json({ error: 'Internal auth verification error', details: err.message });
  }
}

