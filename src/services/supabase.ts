import { createClient } from '@supabase/supabase-js';

// These should be stored in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          profile_picture_url: string | null;
          weight_unit_preference: 'kg' | 'lbs';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          profile_picture_url?: string | null;
          weight_unit_preference?: 'kg' | 'lbs';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          profile_picture_url?: string | null;
          weight_unit_preference?: 'kg' | 'lbs';
          created_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          exercise_name: string;
          type: 'machine' | 'free';
          weight: number;
          weight_unit: 'kg' | 'lbs';
          sets: number;
          reps: number[];
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          exercise_name: string;
          type: 'machine' | 'free';
          weight: number;
          weight_unit: 'kg' | 'lbs';
          sets: number;
          reps: number[];
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          exercise_name?: string;
          type?: 'machine' | 'free';
          weight?: number;
          weight_unit?: 'kg' | 'lbs';
          sets?: number;
          reps?: number[];
          notes?: string | null;
          created_at?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          goal: string;
          cover_image_url: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          goal: string;
          cover_image_url?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          goal?: string;
          cover_image_url?: string | null;
          created_by?: string;
          created_at?: string;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: 'admin' | 'member';
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          role?: 'admin' | 'member';
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          role?: 'admin' | 'member';
          joined_at?: string;
        };
      };
      group_invitations: {
        Row: {
          id: string;
          group_id: string;
          email: string;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          email: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          email?: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
        };
      };
    };
  };
}
