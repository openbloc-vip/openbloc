/*
          # [Operation Name]
          Create Admin User

          ## Query Description:
          This script adds a new administrative user to the system with a predefined email and password. It directly inserts records into the `auth.users` and `public.profiles` tables. This is a one-time setup operation to establish the initial administrator account as requested. No existing data will be affected.

          ## Metadata:
          - Schema-Category: ["Data"]
          - Impact-Level: ["Low"]
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - `auth.users`: A new row will be inserted.
          - `public.profiles`: A new row will be inserted, linked to the new user, with the `role` set to 'ADMIN'.

          ## Security Implications:
          - RLS Status: Unchanged.
          - Policy Changes: No.
          - Auth Requirements: This script creates an authentication principal.

          ## Performance Impact:
          - Indexes: None.
          - Triggers: The `handle_new_user` trigger will be bypassed as this script manually creates the profile entry.
          - Estimated Impact: Negligible.
          */

DO $$
DECLARE
  admin_user_id UUID;
  admin_email TEXT := 'jofrets@gmail.com';
BEGIN
  -- Check if the admin user already exists to make the script idempotent
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    -- Create the user in auth.users and get the new user's ID
    -- The password 'ADMINISTRADOR.OPEN' will be securely hashed.
    INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_app_meta_data, aud, role)
    VALUES (
      admin_email,
      crypt('ADMINISTRADOR.OPEN', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      'authenticated',
      'authenticated'
    )
    RETURNING id INTO admin_user_id;

    -- Create the corresponding profile in public.profiles with the ADMIN role
    INSERT INTO public.profiles (id, name, role, gender, category, bib, email)
    VALUES (
      admin_user_id,
      'Jofre Admin', -- Placeholder name
      'ADMIN',
      'Masculí', -- Placeholder gender
      'Absoluta', -- Placeholder category
      1, -- Admin bib number
      admin_email
    );

    RAISE NOTICE 'Admin user % created successfully.', admin_email;
  ELSE
    RAISE NOTICE 'Admin user % already exists. Skipping creation.', admin_email;
  END IF;
END $$;
