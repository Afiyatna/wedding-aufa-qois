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
  email?: string;
  phone?: string;
  attendance: 'yes' | 'no' | 'maybe';
  guest_count: number;
  dietary_restrictions?: string;
  message?: string;
  created_at?: string;
};

export type GuestbookMessage = {
  id?: string;
  name: string;
  message: string;
  created_at?: string;
};