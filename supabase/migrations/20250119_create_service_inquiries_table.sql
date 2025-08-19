-- Create service_inquiries table for service-specific inquiries
CREATE TABLE IF NOT EXISTS public.service_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_type TEXT NOT NULL, -- e.g., 'consultation', 'design', 'installation', 'maintenance'
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    preferred_contact_method TEXT DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'both')),
    description TEXT NOT NULL,
    requirements TEXT, -- Detailed requirements or specifications
    budget_range TEXT, -- e.g., 'under_1000', '1000_5000', '5000_10000', 'above_10000'
    timeline TEXT, -- e.g., 'asap', 'within_month', 'within_quarter', 'flexible'
    location TEXT, -- Project location
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'in_progress', 'quoted', 'accepted', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    attachments TEXT[], -- Array of file URLs or attachment references
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Staff member assigned to handle this inquiry
    notes TEXT, -- Internal notes for staff
    follow_up_date TIMESTAMPTZ, -- When to follow up
    quote_amount DECIMAL(10,2), -- Quote amount if provided
    quote_sent_at TIMESTAMPTZ, -- When quote was sent
    contacted_at TIMESTAMPTZ, -- When customer was first contacted
    completed_at TIMESTAMPTZ, -- When service was completed
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS service_inquiries_customer_id_idx ON public.service_inquiries(customer_id);
CREATE INDEX IF NOT EXISTS service_inquiries_service_type_idx ON public.service_inquiries(service_type);
CREATE INDEX IF NOT EXISTS service_inquiries_status_idx ON public.service_inquiries(status);
CREATE INDEX IF NOT EXISTS service_inquiries_priority_idx ON public.service_inquiries(priority);
CREATE INDEX IF NOT EXISTS service_inquiries_assigned_to_idx ON public.service_inquiries(assigned_to);
CREATE INDEX IF NOT EXISTS service_inquiries_created_at_idx ON public.service_inquiries(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for service_inquiries table
CREATE POLICY "Allow public to insert service inquiries" ON public.service_inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view service inquiries" ON public.service_inquiries
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update service inquiries" ON public.service_inquiries
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete service inquiries" ON public.service_inquiries
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_service_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_service_inquiries_updated_at
    BEFORE UPDATE ON public.service_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_service_inquiries_updated_at();
