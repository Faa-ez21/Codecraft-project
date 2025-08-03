import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    );

    const { name, contact, product_id, message } = await req.json();

    if (!name || !contact || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, contact, and message are required' }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseClient
      .from('inquiries')
      .insert([{ name, contact, product_id, message }]);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
