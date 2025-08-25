# Email Reply System Setup Guide

## 📧 Setting Up Email Functionality

To enable actual email sending in your inquiry reply system, follow these steps:

### 1. Deploy the Supabase Edge Function

Run these commands in your terminal from the project root:

```bash
# Deploy the email function
supabase functions deploy send-reply-email

# Set the Resend API key (get this from resend.com)
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

### 2. Set up Email Service Provider (Resend.com)

1. Go to [resend.com](https://resend.com) and create a free account
2. Verify your domain (expertofficefurnish.com) or use their sandbox domain for testing
3. Get your API key from the dashboard
4. Add the API key to Supabase secrets (see step 1 above)

### 3. Create Database Table for Reply Tracking

Run this SQL in your Supabase SQL editor:

```sql
-- Create inquiry_replies table for tracking sent email replies
CREATE TABLE IF NOT EXISTS public.inquiry_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    inquiry_id UUID REFERENCES public.inquiries(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sent_to TEXT NOT NULL,
    email_id TEXT, -- Email service provider ID for tracking
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'bounced')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS inquiry_replies_inquiry_id_idx ON public.inquiry_replies(inquiry_id);
CREATE INDEX IF NOT EXISTS inquiry_replies_sent_at_idx ON public.inquiry_replies(sent_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.inquiry_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for inquiry_replies table
CREATE POLICY "Allow authenticated users to view inquiry replies" ON public.inquiry_replies
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert inquiry replies" ON public.inquiry_replies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update inquiry replies" ON public.inquiry_replies
    FOR UPDATE USING (auth.role() = 'authenticated');
```

### 4. Testing the Email System

1. Go to your admin dashboard
2. Open an inquiry
3. Click the "Reply" button (green send icon)
4. Compose your message using the templates or write custom content
5. Click "Send Reply"
6. Check the customer's email inbox (it may take a few minutes)

### 5. Alternative Email Services

If you prefer a different email service, you can modify the Edge Function to use:

- **SendGrid**: Replace the Resend API calls with SendGrid API
- **AWS SES**: Use AWS Simple Email Service
- **Mailgun**: Use Mailgun API
- **SMTP**: Use any SMTP server

### 6. Email Template Customization

The emails are sent with professional HTML templates that include:

- ✅ Company logo and branding
- ✅ Professional header with company colors
- ✅ Formatted message content
- ✅ Company signature
- ✅ Contact information
- ✅ Mobile-responsive design

### 7. Troubleshooting

**Common Issues:**

1. **Email not sending**: Check Supabase function logs and API key
2. **Domain verification**: Make sure your domain is verified with the email provider
3. **Spam folder**: Check customer's spam/junk folder
4. **Rate limits**: Free plans have sending limits

**Check Function Logs:**

```bash
supabase functions logs send-reply-email
```

### 8. Production Considerations

For production use:

- ✅ Set up proper domain verification
- ✅ Configure SPF, DKIM, and DMARC records
- ✅ Monitor email delivery rates
- ✅ Set up webhook endpoints for delivery notifications
- ✅ Implement unsubscribe functionality
- ✅ Add email templates for different inquiry types

## 🎯 Features Included

✅ **Professional Email Templates**: HTML emails with company branding
✅ **Reply Tracking**: Database logging of all sent emails
✅ **Status Updates**: Inquiry status automatically updated to "responded"
✅ **Error Handling**: Proper error messages and fallbacks
✅ **Responsive Design**: Emails look great on all devices
✅ **Company Branding**: Consistent with your company identity

## 📞 Support

If you need help setting up the email functionality, the system will show appropriate error messages to guide you through the setup process.
