-- =============================================================================
-- SERVICE INQUIRIES SCHEMA FOR SUPABASE
-- =============================================================================
-- This schema creates the complete service_inquiries system
-- Run this in your Supabase SQL Editor to set up the service inquiry system
-- =============================================================================

-- First, ensure we have the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. CREATE SERVICE_INQUIRIES TABLE
-- =============================================================================

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS public.service_inquiries CASCADE;

-- Create the service_inquiries table
CREATE TABLE public.service_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_type TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    preferred_contact_method TEXT DEFAULT 'email',
    description TEXT NOT NULL,
    requirements TEXT,
    budget_range TEXT,
    timeline TEXT,
    location TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    attachments TEXT[],
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    follow_up_date TIMESTAMPTZ,
    quote_amount DECIMAL(10,2),
    quote_sent_at TIMESTAMPTZ,
    contacted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Add constraints
    CONSTRAINT service_inquiries_preferred_contact_method_check 
        CHECK (preferred_contact_method IN ('email', 'phone', 'both')),
    CONSTRAINT service_inquiries_status_check 
        CHECK (status IN ('pending', 'contacted', 'in_progress', 'quoted', 'accepted', 'completed', 'cancelled')),
    CONSTRAINT service_inquiries_priority_check 
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CONSTRAINT service_inquiries_email_format_check 
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- =============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS service_inquiries_customer_id_idx 
    ON public.service_inquiries(customer_id);
    
CREATE INDEX IF NOT EXISTS service_inquiries_service_type_idx 
    ON public.service_inquiries(service_type);
    
CREATE INDEX IF NOT EXISTS service_inquiries_status_idx 
    ON public.service_inquiries(status);
    
CREATE INDEX IF NOT EXISTS service_inquiries_priority_idx 
    ON public.service_inquiries(priority);
    
CREATE INDEX IF NOT EXISTS service_inquiries_assigned_to_idx 
    ON public.service_inquiries(assigned_to);
    
CREATE INDEX IF NOT EXISTS service_inquiries_created_at_idx 
    ON public.service_inquiries(created_at);
    
CREATE INDEX IF NOT EXISTS service_inquiries_email_idx 
    ON public.service_inquiries(email);
    
CREATE INDEX IF NOT EXISTS service_inquiries_company_idx 
    ON public.service_inquiries(company);

-- =============================================================================
-- 3. CREATE UPDATED_AT TRIGGER FUNCTION
-- =============================================================================

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_service_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS update_service_inquiries_updated_at ON public.service_inquiries;
CREATE TRIGGER update_service_inquiries_updated_at
    BEFORE UPDATE ON public.service_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_service_inquiries_updated_at();

-- =============================================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 5. CREATE RLS POLICIES
-- =============================================================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow public to insert service inquiries" ON public.service_inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to view service inquiries" ON public.service_inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to update service inquiries" ON public.service_inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to delete service inquiries" ON public.service_inquiries;

-- Policy 1: Allow anyone to insert service inquiries (for public form submissions)
CREATE POLICY "Allow public to insert service inquiries" 
    ON public.service_inquiries
    FOR INSERT 
    WITH CHECK (true);

-- Policy 2: Allow authenticated users to view all service inquiries (for admin dashboard)
CREATE POLICY "Allow authenticated users to view service inquiries" 
    ON public.service_inquiries
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Policy 3: Allow authenticated users to update service inquiries (for admin management)
CREATE POLICY "Allow authenticated users to update service inquiries" 
    ON public.service_inquiries
    FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Policy 4: Allow authenticated users to delete service inquiries (for admin management)
CREATE POLICY "Allow authenticated users to delete service inquiries" 
    ON public.service_inquiries
    FOR DELETE 
    USING (auth.role() = 'authenticated');

-- =============================================================================
-- 6. CREATE SERVICE_INQUIRY_REPLIES TABLE (FOR TRACKING EMAIL REPLIES)
-- =============================================================================

-- Drop table if exists
DROP TABLE IF EXISTS public.service_inquiry_replies CASCADE;

-- Create service inquiry replies table
CREATE TABLE public.service_inquiry_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_inquiry_id UUID REFERENCES public.service_inquiries(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    sent_to TEXT NOT NULL,
    sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email_id TEXT,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'bounced')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for service inquiry replies
CREATE INDEX IF NOT EXISTS service_inquiry_replies_service_inquiry_id_idx 
    ON public.service_inquiry_replies(service_inquiry_id);
    
CREATE INDEX IF NOT EXISTS service_inquiry_replies_sent_at_idx 
    ON public.service_inquiry_replies(sent_at);

-- Enable RLS for service inquiry replies
ALTER TABLE public.service_inquiry_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for service inquiry replies
CREATE POLICY "Allow authenticated users to view service inquiry replies" 
    ON public.service_inquiry_replies
    FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert service inquiry replies" 
    ON public.service_inquiry_replies
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update service inquiry replies" 
    ON public.service_inquiry_replies
    FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- =============================================================================
-- 7. CREATE SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =============================================================================

-- Uncomment the following section if you want to insert sample data for testing

/*
INSERT INTO public.service_inquiries (
    service_type, name, email, phone, company, description, 
    budget_range, timeline, location, status, priority
) VALUES 
(
    'office_design', 
    'John Smith', 
    'john.smith@example.com', 
    '+233 123 456 789', 
    'Smith Enterprises', 
    'We need a complete office design for our new 50-person office space in Accra.',
    '10000_25000',
    'within_quarter',
    'Accra, Ghana',
    'pending',
    'medium'
),
(
    'furniture_providers', 
    'Sarah Johnson', 
    'sarah@techcorp.com', 
    '+233 987 654 321', 
    'TechCorp Ghana', 
    'Looking for ergonomic office furniture for 30 employees including desks, chairs, and storage.',
    '5000_10000',
    'within_month',
    'Kumasi, Ghana',
    'contacted',
    'high'
),
(
    'consultancy', 
    'Michael Brown', 
    'mbrown@startup.gh', 
    NULL, 
    'StartupGH', 
    'Need consultation on optimizing our current office space for better productivity.',
    'under_1000',
    'asap',
    'Tema, Ghana',
    'pending',
    'urgent'
);
*/

-- =============================================================================
-- 8. GRANT PERMISSIONS
-- =============================================================================

-- Grant necessary permissions to authenticated users
GRANT ALL ON public.service_inquiries TO authenticated;
GRANT ALL ON public.service_inquiry_replies TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================================================
-- 9. CREATE VIEWS FOR ANALYTICS (OPTIONAL)
-- =============================================================================

-- Create a view for service inquiry statistics
CREATE OR REPLACE VIEW public.service_inquiry_stats AS
SELECT 
    COUNT(*) as total_inquiries,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'contacted') as contacted_count,
    COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
    COUNT(*) FILTER (WHERE status = 'quoted') as quoted_count,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
    COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_count,
    COUNT(*) FILTER (WHERE priority = 'high') as high_priority_count,
    AVG(quote_amount) as average_quote_amount,
    COUNT(DISTINCT service_type) as unique_service_types
FROM public.service_inquiries;

-- Grant select permission on the view
GRANT SELECT ON public.service_inquiry_stats TO authenticated;

-- =============================================================================
-- SCHEMA CREATION COMPLETE
-- =============================================================================

-- Verify the schema was created successfully
SELECT 
    'service_inquiries table created successfully' as status,
    COUNT(*) as row_count
FROM public.service_inquiries

UNION ALL

SELECT 
    'service_inquiry_replies table created successfully' as status,
    COUNT(*) as row_count
FROM public.service_inquiry_replies;

-- Show table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'service_inquiries'
ORDER BY ordinal_position;
