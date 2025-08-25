-- =============================================================================
-- SIMPLE SERVICE INQUIRIES SCHEMA FOR SUPABASE
-- =============================================================================
-- Copy and paste this ENTIRE code into your Supabase SQL Editor
-- Then click "RUN" to create the service inquiries system
-- =============================================================================

-- 1. Create the service_inquiries table
CREATE TABLE IF NOT EXISTS public.service_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID,
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
    assigned_to UUID,
    notes TEXT,
    follow_up_date TIMESTAMPTZ,
    quote_amount DECIMAL(10,2),
    quote_sent_at TIMESTAMPTZ,
    contacted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS service_inquiries_service_type_idx ON public.service_inquiries(service_type);
CREATE INDEX IF NOT EXISTS service_inquiries_status_idx ON public.service_inquiries(status);
CREATE INDEX IF NOT EXISTS service_inquiries_priority_idx ON public.service_inquiries(priority);
CREATE INDEX IF NOT EXISTS service_inquiries_created_at_idx ON public.service_inquiries(created_at);
CREATE INDEX IF NOT EXISTS service_inquiries_email_idx ON public.service_inquiries(email);

-- 3. Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_service_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger (drop first if exists)
DROP TRIGGER IF EXISTS update_service_inquiries_updated_at ON public.service_inquiries;
CREATE TRIGGER update_service_inquiries_updated_at
    BEFORE UPDATE ON public.service_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_service_inquiries_updated_at();

-- 5. Enable Row Level Security
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;

-- 6. Create policies
CREATE POLICY "Allow public to insert service inquiries" ON public.service_inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view service inquiries" ON public.service_inquiries
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update service inquiries" ON public.service_inquiries
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete service inquiries" ON public.service_inquiries
    FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Create service inquiry replies table
CREATE TABLE IF NOT EXISTS public.service_inquiry_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_inquiry_id UUID REFERENCES public.service_inquiries(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    sent_to TEXT NOT NULL,
    sent_by UUID,
    email_id TEXT,
    status TEXT DEFAULT 'sent',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Create index for replies
CREATE INDEX IF NOT EXISTS service_inquiry_replies_service_inquiry_id_idx ON public.service_inquiry_replies(service_inquiry_id);

-- 9. Enable RLS for replies
ALTER TABLE public.service_inquiry_replies ENABLE ROW LEVEL SECURITY;

-- 10. Create policies for replies
CREATE POLICY "Allow authenticated users to view service inquiry replies" ON public.service_inquiry_replies
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert service inquiry replies" ON public.service_inquiry_replies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 11. Grant permissions
GRANT ALL ON public.service_inquiries TO authenticated;
GRANT ALL ON public.service_inquiry_replies TO authenticated;

-- 12. Verify creation
SELECT 'Service inquiries schema created successfully!' as message;
