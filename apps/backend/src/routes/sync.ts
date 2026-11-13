import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.js';
import { createUserClient } from '../db.js';
import { z } from 'zod';

export const syncRouter = Router();

const syncPayloadSchema = z.object({
  tracks: z.array(z.object({
    youtube_id: z.string(),
    title: z.string(),
    channel: z.string().default(''),
    is_custom: z.boolean().default(true)
  })).optional().default([]),
  wallpapers: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.enum(['image', 'video']).default('image'),
    is_custom: z.boolean().default(true)
  })).optional().default([]),
  todos: z.array(z.object({
    text: z.string(),
    completed: z.boolean().default(false),
    is_routine: z.boolean().default(false)
  })).optional().default([])
});

syncRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parsed = syncPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
      return;
    }

    const { tracks, wallpapers, todos } = parsed.data;
    const supabase = createUserClient(req.token!);
    const userId = req.user!.id;

    // 1. Sync Tracks (Insert new ones if not present)
    if (tracks.length > 0) {
      const records = tracks.map(t => ({
        user_id: userId,
        youtube_id: t.youtube_id,
        title: t.title,
        channel: t.channel,
        is_custom: true
      }));
      await supabase.from('user_youtube_tracks').insert(records);
    }

    // 2. Sync Wallpapers
    if (wallpapers.length > 0) {
      const records = wallpapers.map(w => ({
        user_id: userId,
        title: w.title,
        url: w.url,
        type: w.type,
        is_custom: true
      }));
      await supabase.from('user_wallpapers').insert(records);
    }

    // 3. Sync Todos
    if (todos.length > 0) {
      const records = todos.map(td => ({
        user_id: userId,
        text: td.text,
        completed: td.completed,
        is_routine: td.is_routine
      }));
      await supabase.from('user_todos').insert(records);
    }

    // Fetch full active lists to return back to frontend
    const [tracksRes, wallpapersRes, todosRes] = await Promise.all([
      supabase.from('user_youtube_tracks').select('*').order('created_at', { ascending: false }),
      supabase.from('user_wallpapers').select('*').order('created_at', { ascending: false }),
      supabase.from('user_todos').select('*').order('created_at', { ascending: true })
    ]);

    res.json({
      success: true,
      data: {
        tracks: tracksRes.data || [],
        wallpapers: wallpapersRes.data || [],
        todos: todosRes.data || []
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

