import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qmtvvembndpnjmjlyeri.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtdHZ2ZW1ibmRwbmptamx5ZXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NDY1MTAsImV4cCI6MjExMDEyMjUxMH0.WiKgNYcSuPXUgwGaDO4TisPoHV3r_HFMzqOGWEDXEeU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000/api/v1';
