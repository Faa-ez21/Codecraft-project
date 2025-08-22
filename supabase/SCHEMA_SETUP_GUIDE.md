# Service Inquiries Schema Setup Guide

## 📋 Step-by-Step Instructions

### Method 1: Using Supabase Dashboard (Recommended)

1. **Open your Supabase Dashboard**

   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**

   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the Schema**

   - Copy the ENTIRE content from `SIMPLE_SERVICE_SCHEMA.sql`
   - Paste it into the SQL Editor

4. **Execute the Schema**
   - Click the "Run" button (or press Ctrl+Enter)
   - Wait for success message

### Method 2: Using Supabase CLI (If you have it installed)

```bash
# Navigate to your project directory
cd "c:\Users\USER\Desktop\Expert-office-Furnish-final"

# Apply the migration
npx supabase db push
```

## 🔧 What the Schema Creates

### Tables Created:

1. **`service_inquiries`** - Main table for service requests
2. **`service_inquiry_replies`** - Table for tracking email replies

### Fields in service_inquiries:

- `id` - Unique identifier
- `service_type` - Type of service requested
- `name`, `email`, `phone`, `company` - Customer details
- `description`, `requirements` - Project details
- `budget_range`, `timeline`, `location` - Project parameters
- `status`, `priority` - Management fields
- `created_at`, `updated_at` - Timestamps

### Security:

- Row Level Security (RLS) enabled
- Public can insert (for form submissions)
- Authenticated users can manage (for admin dashboard)

## 🧪 Testing the Schema

After running the schema, you can test it by:

1. **Testing Insertion:**

```sql
INSERT INTO public.service_inquiries (
    service_type, name, email, description
) VALUES (
    'office_design',
    'Test User',
    'test@example.com',
    'Test service inquiry'
);
```

2. **Testing Selection:**

```sql
SELECT * FROM public.service_inquiries
ORDER BY created_at DESC;
```

## 🔍 Troubleshooting

### Common Issues:

1. **Permission Denied Error:**

   - Make sure you're running this as a project owner
   - Check if RLS policies are correctly set

2. **Table Already Exists:**

   - The schema uses `IF NOT EXISTS` so it's safe to run multiple times
   - If you need to recreate, first run: `DROP TABLE public.service_inquiries CASCADE;`

3. **Function Errors:**
   - Make sure PostgreSQL extensions are enabled in your Supabase project

### Verification Queries:

```sql
-- Check if table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'service_inquiries';

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'service_inquiries'
AND table_schema = 'public';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'service_inquiries';
```

## 🚀 Next Steps

After creating the schema:

1. **Test the client-side form:**

   - Go to http://localhost:5001/services
   - Click "Get Quote" on any service
   - Fill out the form and submit

2. **Test the admin dashboard:**

   - Go to http://localhost:5000/service-inquiries
   - View submitted inquiries
   - Test status updates and replies

3. **Check data:**
   - Use Supabase dashboard Table Editor
   - Or run SQL queries to verify data

## 📝 Notes

- The schema is designed to work with your existing authentication system
- All timestamps are in UTC
- The schema includes proper indexing for performance
- Email validation is included in the constraints
- The system supports file attachments (URLs stored as text array)

If you encounter any errors, please share the specific error message and I'll help you resolve it!
