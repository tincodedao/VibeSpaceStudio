import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config.js';
import { authRouter } from './routes/auth.js';
import { tracksRouter } from './routes/tracks.js';
import { wallpapersRouter } from './routes/wallpapers.js';
import { todosRouter } from './routes/todos.js';
import { syncRouter } from './routes/sync.js';

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'VibeSpace Backend',
    environment: config.nodeEnv
  });
});

// API Routes v1
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tracks', tracksRouter);
app.use('/api/v1/wallpapers', wallpapersRouter);
app.use('/api/v1/todos', todosRouter);
app.use('/api/v1/sync', syncRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`[VibeSpace Backend] Server listening on port ${config.port} (${config.nodeEnv})`);
  });
}

export default app;
