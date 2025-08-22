// backend/lib/supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Supabase service role key or URL missing in .env');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // KEEP THIS ON THE SERVER ONLY
  { auth: { persistSession: false } }
);

module.exports = { supabase };
