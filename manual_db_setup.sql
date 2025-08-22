-- Manual database setup for testing if migrations fail
-- Run this in Supabase SQL editor if needed

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    location text,
    orders integer DEFAULT 0,
    spent numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create users table for admins
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    phone text,
    address text,
    city text,
    avatar_url text,
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Basic policies for customers
CREATE POLICY "Customers can view own profile" ON public.customers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can update own profile" ON public.customers
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert customer" ON public.customers
    FOR INSERT WITH CHECK (true);

-- Basic policies for users (admins)
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Create an admin user for testing
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'admin@expertoffice.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    now()
) ON CONFLICT (email) DO NOTHING;

-- Add admin to users table
INSERT INTO public.users (id, name, email, role)
SELECT id, 'Admin User', email, 'admin'
FROM auth.users 
WHERE email = 'admin@expertoffice.com'
ON CONFLICT (id) DO NOTHING;
