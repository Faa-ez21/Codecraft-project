-- Fix user tables and policies to separate customers and admins
-- This migration creates proper table structure and fixes infinite recursion

-- 1. First, drop any problematic policies that might cause infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to view users" ON public.users;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;

-- 2. Create customers table if it doesn't exist
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

-- 3. Ensure users table exists for admins/staff
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

-- 4. Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable RLS on both tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 6. Create safe RLS policies for customers table
CREATE POLICY "Customers can view own profile" ON public.customers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can update own profile" ON public.customers
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can insert customer profiles" ON public.customers
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow admins to view and manage customers
CREATE POLICY "Admins can view all customers" ON public.customers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins can update customers" ON public.customers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'manager')
        )
    );

-- 7. Create safe RLS policies for users table (admins only)
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users AS u
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can insert users" ON public.users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users AS u
            WHERE u.id = auth.uid() 
            AND u.role = 'admin'
        )
    );

CREATE POLICY "Admins can update users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users AS u
            WHERE u.id = auth.uid() 
            AND u.role = 'admin'
        )
    );

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 8. Create function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Check if this is an admin registration by email domain or specific emails
    IF NEW.email LIKE '%@expertoffice.%' OR NEW.email IN ('admin@example.com', 'manager@example.com') THEN
        -- Create admin user
        INSERT INTO public.users (id, name, email, role)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            NEW.email,
            'admin'
        );
    ELSE
        -- Create customer user
        INSERT INTO public.customers (id, name, email)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            NEW.email
        );
    END IF;
    RETURN NEW;
END;
$$ language plpgsql security definer;

-- 9. Create trigger for automatic user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- 11. Create view for easy customer management in admin dashboard
CREATE OR REPLACE VIEW public.customer_details AS
SELECT 
    c.*,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_spent
FROM public.customers c
LEFT JOIN public.orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.email, c.phone, c.location, c.orders, c.spent, c.created_at, c.updated_at;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.customers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.customer_details TO authenticated;
