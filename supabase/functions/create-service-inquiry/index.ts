import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const {
      name,
      email,
      phone,
      company,
      service_type,
      description,
      requirements,
      budget_range,
      timeline,
      location,
      preferred_contact_method,
    } = await req.json();

    if (!name || !email || !service_type || !description) {
      return new Response(
        JSON.stringify({
          error: "Name, email, service_type, and description are required",
        }),
        { status: 400 }
      );
    }

    const serviceInquiryData = {
      name,
      email,
      phone: phone || null,
      company: company || null,
      service_type,
      description,
      requirements: requirements || null,
      budget_range: budget_range || null,
      timeline: timeline || null,
      location: location || null,
      preferred_contact_method: preferred_contact_method || "email",
      status: "pending",
      priority: "medium",
    };

    const { data, error } = await supabaseClient
      .from("service_inquiries")
      .insert([serviceInquiryData]);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 201,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
