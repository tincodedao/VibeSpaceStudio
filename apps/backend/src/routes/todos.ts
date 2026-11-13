import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.js';
import { createUserClient } from '../db.js';
import { z } from 'zod';

export const todosRouter = Router();

const createTodoSchema = z.object({
  text: z.string().min(1),
  completed: z.boolean().default(false),
  is_routine: z.boolean().default(false)
});

const updateTodoSchema = z.object({
  text: z.string().min(1).optional(),
  completed: z.boolean().optional(),
  is_routine: z.boolean().optional()
});

todosRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const supabase = createUserClient(req.token!);
    const { data, error } = await supabase
      .from('user_todos')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

todosRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parsed = createTodoSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
      return;
    }

    const supabase = createUserClient(req.token!);
    const { data, error } = await supabase
      .from('user_todos')
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

todosRouter.put('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parsed = updateTodoSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
      return;
    }

    const supabase = createUserClient(req.token!);
    const { data, error } = await supabase
      .from('user_todos')
      .update({
        ...parsed.data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

todosRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = createUserClient(req.token!);
    const { error } = await supabase
      .from('user_todos')
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
