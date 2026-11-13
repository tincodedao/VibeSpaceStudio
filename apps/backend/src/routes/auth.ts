import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.js';
import { createUserClient } from '../db.js';

export const authRouter = Router();

authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const supabase = createUserClient(req.token!);
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.user!.id)
      .single();

    res.json({
      user: req.user,
      profile: profile || {
        id: req.user!.id,
        display_name: req.user!.email?.split('@')[0] || 'User',
        avatar_url: ''
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
