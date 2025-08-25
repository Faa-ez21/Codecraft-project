-- Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON public.subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_subscribed_at ON public.subscribers(subscribed_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers table
CREATE POLICY "Allow public to insert subscribers" ON public.subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view subscribers" ON public.subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update subscribers" ON public.subscribers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create newsletter_campaigns table for admin dashboard
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    html_content TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'scheduled')),
    target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'specific')),
    recipient_emails TEXT[], -- For specific targeting
    sent_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for newsletter_campaigns
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletter_campaigns table
CREATE POLICY "Allow authenticated users to manage newsletter campaigns" ON public.newsletter_campaigns
    FOR ALL USING (auth.role() = 'authenticated');

-- Create newsletter_sends table to track individual sends
CREATE TABLE IF NOT EXISTS public.newsletter_sends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.newsletter_campaigns(id) ON DELETE CASCADE,
    subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for newsletter_sends
ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletter_sends table
CREATE POLICY "Allow authenticated users to manage newsletter sends" ON public.newsletter_sends
    FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON public.newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created_by ON public.newsletter_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_campaign_id ON public.newsletter_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_subscriber_id ON public.newsletter_sends(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_status ON public.newsletter_sends(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_campaigns_updated_at
    BEFORE UPDATE ON public.newsletter_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
