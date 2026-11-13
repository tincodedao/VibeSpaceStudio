import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import { config } from './config.js';

export const supabaseAdmin = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

export function createUserClient(accessToken: string) {
  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export const pool = config.databaseUrl
  ? new Pool({
      connectionString: config.databaseUrl,
      ssl: { rejectUnauthorized: false }
    })
  : null;
