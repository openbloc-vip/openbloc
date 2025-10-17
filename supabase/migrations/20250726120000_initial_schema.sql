/*
          # Initial Schema for ClimbComp

          This script sets up the initial database schema for the climbing competition application. It creates enumerations for consistent data, tables for profiles, boulders, and completions, and establishes relationships between them. It also implements Row Level Security (RLS) and a trigger for automatic profile creation on user sign-up.

          ## Query Description: This operation is structural and safe for a new database. It defines the entire application data model. If run on an existing database with conflicting table names, it could cause errors. It is designed to be run once on a clean Supabase project. There is no risk of data loss as it only creates new structures.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - **Types Created:** user_role, user_gender, user_category, boulder_difficulty, boulder_color.
          - **Tables Created:** profiles, boulders, completed_boulders.
          - **Functions Created:** handle_new_user.
          - **Triggers Created:** on_auth_user_created.
          
          ## Security Implications:
          - RLS Status: Enabled on all new tables.
          - Policy Changes: Yes, new policies are created to manage data access based on user roles and ownership.
          - Auth Requirements: Policies rely on `auth.uid()` to identify the current user.
          
          ## Performance Impact:
          - Indexes: Primary keys and foreign keys are indexed by default.
          - Triggers: A trigger is added to `auth.users` which fires once on user creation.
          - Estimated Impact: Low. The setup is standard and optimized for common query patterns.
          */

-- 1. Create ENUM types for structured data
CREATE TYPE public.user_role AS ENUM ('ADMIN', 'PARTICIPANT');
CREATE TYPE public.user_gender AS ENUM ('Masculí', 'Femení');
CREATE TYPE public.user_category AS ENUM ('Universitaris', 'Absoluta', 'Sub-18');
CREATE TYPE public.boulder_difficulty AS ENUM ('Molt Fàcil', 'Fàcil', 'Mitjà', 'Difícil');
CREATE TYPE public.boulder_color AS ENUM ('green', 'blue', 'yellow', 'red', 'purple', 'black');

-- 2. Create the 'profiles' table to store user-specific data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    bib INT UNIQUE NOT NULL,
    role public.user_role NOT NULL DEFAULT 'PARTICIPANT',
    gender public.user_gender NOT NULL,
    category public.user_category NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';

-- 3. Create the 'boulders' table
CREATE TABLE public.boulders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number INT UNIQUE NOT NULL,
    color public.boulder_color NOT NULL,
    difficulty public.boulder_difficulty NOT NULL,
    points INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.boulders IS 'Stores information about each climbing boulder problem.';

-- 4. Create the 'completed_boulders' join table
CREATE TABLE public.completed_boulders (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    boulder_id UUID NOT NULL REFERENCES public.boulders(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, boulder_id)
);

COMMENT ON TABLE public.completed_boulders IS 'Tracks which boulders have been completed by which users.';

-- 5. Enable Row Level Security (RLS) for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boulders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_boulders ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for 'profiles'
CREATE POLICY "Profiles are viewable by everyone."
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 7. Create RLS policies for 'boulders'
CREATE POLICY "Boulders are viewable by everyone."
    ON public.boulders FOR SELECT USING (true);

CREATE POLICY "Admins can create boulders."
    ON public.boulders FOR INSERT WITH CHECK (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN'
    );

CREATE POLICY "Admins can update boulders."
    ON public.boulders FOR UPDATE USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN'
    );

CREATE POLICY "Admins can delete boulders."
    ON public.boulders FOR DELETE USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN'
    );
    
-- 8. Create RLS policies for 'completed_boulders'
CREATE POLICY "Users can view their own completed boulders."
    ON public.completed_boulders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own completed boulders."
    ON public.completed_boulders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own completed boulders."
    ON public.completed_boulders FOR DELETE USING (auth.uid() = user_id);

-- 9. Create a function to handle new user sign-ups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, bib, gender, category, role)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'name',
        (new.raw_user_meta_data->>'bib')::INT,
        (new.raw_user_meta_data->>'gender')::public.user_gender,
        (new.raw_user_meta_data->>'category')::public.user_category,
        'PARTICIPANT' -- Default role
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create a trigger to call the function when a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
