import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.js';
import { createUserClient } from '../db.js';
import { z } from 'zod';

export const wallpapersRouter = Router();

const createWallpaperSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  type: z.enum(['image', 'video']).default('image'),
  is_custom: z.boolean().default(true)
});

wallpapersRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const supabase = createUserClient(req.token!);
    const { data, error } = await supabase
      .from('user_wallpapers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

wallpapersRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parsed = createWallpaperSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
      return;
    }

    const supabase = createUserClient(req.token!);
    const { data, error } = await supabase
      .from('user_wallpapers')
      .insert({
        user_id: req.user!.id,
        ...parsed.data
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

wallpapersRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = createUserClient(req.token!);
    const { error } = await supabase
      .from('user_wallpapers')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

