import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'ADMIN' | 'PARTICIPANT';
export type Gender = 'Masculí' | 'Femení';
export type Category = 'Universitaris' | 'Absoluta' | 'Sub-18';
export type BoulderColor = 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'black';
export type Difficulty = 'Molt Fàcil' | 'Fàcil' | 'Mitjà' | 'Difícil';

// Represents the public.profiles table
export interface Profile {
  id: string; // Foreign key to auth.users.id
  name: string;
  bib: number;
  role: UserRole;
  gender: Gender;
  category: Category;
  email: string; // Added for convenience
}

// Represents the public.boulders table
export interface Boulder {
  id: string; // Changed to string for UUID
  number: number;
  color: BoulderColor;
  difficulty: Difficulty;
  points: number;
  created_at: string;
}

// Represents the public.completed_boulders table
export interface CompletedBoulder {
    user_id: string;
    boulder_id: string;
    created_at: string;
}

// Combined type for authenticated user
export interface AppUser {
    supabaseUser: SupabaseUser;
    profile: Profile;
}
