/*
# [Operation Name]
Create Admin User (Corrected)

## Query Description: [This script corrects a previous error and securely creates an administrative user for the 'Open Bloc 2025' application. It inserts the user directly into Supabase's authentication system and creates a corresponding profile with ADMIN privileges. This is a one-time setup operation.]

## Metadata:
- Schema-Category: ["Data"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [false]

## Structure Details:
- Inserts one row into `auth.users`.
- Inserts one row into `public.profiles`.

## Security Implications:
- RLS Status: [Not Applicable]
- Policy Changes: [No]
- Auth Requirements: [Creates a new admin user with a predefined password.]

## Performance Impact:
- Indexes: [No change]
- Triggers: [Does not fire the `create_user_profile` trigger as it's a manual insertion.]
- Estimated Impact: [Negligible]
*/
DO $$
DECLARE
  admin_email TEXT := 'jofrets@gmail.com';
  admin_password TEXT := 'ADMINISTRADOR.OPEN';
  admin_user_id UUID;
BEGIN
  -- Create the user in auth.users with an explicit UUID and instance_id
  -- This corrects the previous migration error.
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
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
    '{"provider":"email","providers":["email"]}',
    NOW(),
    NOW()
  )
  RETURNING id INTO admin_user_id;

  -- Create the corresponding profile with the ADMIN role
  -- This links the auth user to the application's profile data.
  INSERT INTO public.profiles (id, name, email, role, bib, gender, category)
  VALUES (
    admin_user_id,
    'Jofre TS (Admin)',
    admin_email,
    'ADMIN',
    999,
    'Masculí',
    'Absoluta'
  );
END $$;
