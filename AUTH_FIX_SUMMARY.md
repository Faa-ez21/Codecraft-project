# Authentication and User Storage Fix Summary

## Issues Addressed:

1. **Session timeout errors** in AuthContext.jsx
2. **Infinite recursion in users table policies**
3. **Improper separation between customers and admins**
4. **Products loading failures due to policy conflicts**

## Changes Made:

### 1. Database Schema (Migration: 20250822_fix_recursion_simple.sql)

- Created separate `customers` table for regular users
- Created `users` table specifically for admins/staff
- Simplified RLS policies to avoid infinite recursion
- Temporarily disabled complex policies that caused recursion

### 2. AuthContext.jsx Updates

- Fixed session timeout by removing Promise.race timeout
- Improved user type detection (admin vs customer)
- Added proper error handling for database queries
- Reduced loading time from 5 seconds to 3 seconds
- Added userType field to distinguish admin from customer

### 3. Admin Dashboard Updates

#### Customers.jsx

- Updated to fetch only from `customers` table
- Removed fallback queries to `users` table
- Added proper error handling and data transformation

#### Users.jsx

- Updated to fetch only from `users` table (admins/staff)
- Removed complex join queries that could cause issues
- Simplified data structure

### 4. Table Structure

#### Customers Table:

```sql
- id (uuid, references auth.users)
- name (text)
- email (text)
- phone (text)
- location (text)
- orders (integer, default 0)
- spent (numeric, default 0)
- created_at, updated_at (timestamps)
```

#### Users Table (Admins):

```sql
- id (uuid, references auth.users)
- name (text)
- email (text)
- role (text: admin, manager, user)
- phone (text)
- address (text)
- city (text)
- avatar_url (text)
- status (text: active, inactive)
- created_at, updated_at (timestamps)
```

### 5. Authentication Flow:

1. User signs up/logs in
2. AuthContext checks `users` table first (for admins)
3. If not found, checks `customers` table
4. If neither exists, creates new customer record
5. Sets appropriate role and userType

### 6. RLS Policies:

- Simplified to avoid recursive queries
- Customers can access their own data
- Admins have broader access
- Removed complex EXISTS clauses that caused infinite recursion

## Testing:

- Start client: `cd apps/client-site && npm run dev`
- Start admin: `cd apps/admin-dashboard && npm run dev`
- Apply migration: Run the SQL files in Supabase

## Next Steps:

1. Test login/signup flow
2. Verify customer and admin data separation
3. Ensure products load without policy errors
4. Add more restrictive policies once recursion is confirmed fixed
