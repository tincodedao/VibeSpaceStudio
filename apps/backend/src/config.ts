import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  supabaseUrl: process.env.SUPABASE_URL || 'https://qmtvvembndpnjmjlyeri.supabase.co',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtdHZ2ZW1ibmRwbmptamx5ZXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NDY1MTAsImV4cCI6MjExMDEyMjUxMH0.WiKgNYcSuPXUgwGaDO4TisPoHV3r_HFMzqOGWEDXEeU',
  databaseUrl: process.env.DATABASE_URL || ''
};

