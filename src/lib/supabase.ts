import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type RSVPResponse = {
  id?: string;
  name: string;
  attendance: 'yes' | 'no' | 'maybe';
  message: string;
  parent_id?: string | null;
  created_at?: string;
};