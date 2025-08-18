# Newsletter System Setup Guide

## 🎯 Overview

This guide will help you set up the complete newsletter system with database tables, admin dashboard, and email functionality.

## 📊 Database Schema

### 1. Run this SQL in your Supabase SQL Editor:

```sql
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

-- Create indexes for better performance
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
```

## 🎯 Features Implemented

### ✅ Client Site (Homepage)

- **Exit-Intent Popup**: Captures leaving visitors with 15% discount offer
- **Regular Newsletter Form**: Bottom of homepage for newsletter signup
- **Smart Email Validation**: Prevents duplicate subscriptions
- **Database Integration**: Stores all subscribers with source tracking

### ✅ Admin Dashboard

- **Newsletter Management Page**: Complete admin interface
- **Subscriber Management**: View, search, and export subscribers
- **Campaign Creation**: Create and manage email campaigns
- **Campaign Sending**: Send to all subscribers or specific emails
- **Analytics**: Track subscriber counts and campaign performance
- **Export Functionality**: Download subscriber list as CSV

### ✅ Database Schema

- **subscribers**: Stores email addresses with metadata
- **newsletter_campaigns**: Manages email campaigns
- **newsletter_sends**: Tracks individual email sends
- **Proper Indexing**: Optimized for performance
- **Row Level Security**: Secure access controls

## 🚀 How to Use

### For Customers (Client Site):

1. **Exit-Intent Popup**: Move mouse to top of browser to trigger
2. **Newsletter Form**: Scroll to bottom of homepage to subscribe
3. **Instant Feedback**: Get discount code immediately

### For Admins (Dashboard):

1. **Access Newsletter**: Go to Admin Dashboard → Newsletter
2. **View Subscribers**: See all subscribers in the Subscribers tab
3. **Create Campaign**: Click "New Campaign" to create newsletter
4. **Send Newsletter**: Draft campaigns can be sent to all/specific subscribers
5. **Export Data**: Download subscriber list for external use

## 📧 Email Integration (Optional)

To enable actual email sending:

1. **Deploy Edge Function**:

   ```bash
   npx supabase functions deploy send-newsletter
   ```

2. **Set Environment Variables**:

   ```bash
   npx supabase secrets set RESEND_API_KEY=your_resend_api_key
   ```

3. **Configure Domain**: Set up SPF/DKIM records with your email provider

## 📊 Database Tables Created

1. **subscribers**:

   - `id` (UUID): Primary key
   - `email` (TEXT): Subscriber email
   - `subscribed_at` (TIMESTAMPTZ): Subscription date
   - `source` (TEXT): Where they subscribed from
   - `status` (TEXT): active/unsubscribed

2. **newsletter_campaigns**:

   - `id` (UUID): Primary key
   - `title` (TEXT): Campaign title
   - `subject` (TEXT): Email subject
   - `content` (TEXT): Email content
   - `status` (TEXT): draft/sent/scheduled
   - `target_audience` (TEXT): all/specific

3. **newsletter_sends**:
   - `id` (UUID): Primary key
   - `campaign_id` (UUID): Reference to campaign
   - `subscriber_id` (UUID): Reference to subscriber
   - `email` (TEXT): Email address
   - `status` (TEXT): pending/sent/failed

## 🎉 Success!

Your newsletter system is now fully functional with:

- ✅ Smart popup capturing leaving visitors
- ✅ Regular newsletter signup form
- ✅ Complete admin dashboard
- ✅ Database storage and tracking
- ✅ Campaign management system
- ✅ Export capabilities

## 🔧 Next Steps

1. Run the SQL commands above in Supabase
2. Test the exit-intent popup on your homepage
3. Try subscribing via the newsletter form
4. Access the admin dashboard Newsletter section
5. Create and send your first campaign!
