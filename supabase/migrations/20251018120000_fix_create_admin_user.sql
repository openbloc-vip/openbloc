/*
# [Admin User Creation - Corrected]
This script creates a new administrative user and their corresponding profile.
This version fixes a bug where the user creation trigger failed due to missing metadata.

## Query Description:
This operation inserts a new user directly into the Supabase authentication system. It now includes the required `raw_user_meta_data` so that the `handle_new_user` trigger can successfully populate the `profiles` table. It then updates the newly created profile to grant 'ADMIN' privileges.

## Metadata:
- Schema-Category: ["Data"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true (The user can be deleted manually)
*/
DO $$
DECLARE
  admin_email TEXT := 'jofrets@gmail.com';
  admin_password TEXT := 'ADMINISTRADOR.OPEN';
  admin_user_id UUID;
BEGIN
  -- Insert the user into auth.users, providing the necessary metadata for the trigger.
  -- This metadata will be used by the handle_new_user trigger to create the profile.
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data, -- FIX: Provide metadata for the profile trigger
    raw_app_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000', -- Default instance ID
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    '{"name": "Jofre TS (Admin)", "bib": 0, "gender": "Masculí", "category": "Absoluta", "role": "ADMIN"}',
    '{"provider":"email","providers":["email"]}',
    NOW(),
    NOW()
  )
  RETURNING id INTO admin_user_id;

  -- The handle_new_user trigger will have already created a profile.
  -- We now ensure its role is correctly set to ADMIN.
  UPDATE public.profiles
  SET role = 'ADMIN'
  WHERE id = admin_user_id;

END $$;
