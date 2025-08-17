import { supabase } from "../supabase/supabaseClient";

/**
 * Creates a customer record for users who have auth but missing database record
 */
export const createMissingCustomerRecord = async (user) => {
  try {
    const { error } = await supabase.from("customers").insert({
      id: user.id,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "",
      email: user.email,
      phone: "",
      location: "",
      orders: 0,
      spent: 0,
    });

    if (error) {
      console.error("Error creating customer record:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error creating customer record:", error);
    return { success: false, error };
  }
};

/**
 * Deletes a user from Supabase Auth (admin function)
 */
export const deleteAuthUser = async (userId) => {
  try {
    // This requires admin privileges or RLS policies
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Error deleting auth user:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting auth user:", error);
    return { success: false, error };
  }
};

/**
 * Checks if user exists in auth but missing from database
 */
export const checkUserConsistency = async (email) => {
  try {
    // Check if customer exists in database
    const { data: customerData } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .single();

    // Check if admin exists in database
    const { data: adminData } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    return {
      hasCustomerRecord: !!customerData,
      hasAdminRecord: !!adminData,
      hasAnyRecord: !!(customerData || adminData),
    };
  } catch (error) {
    console.error("Error checking user consistency:", error);
    return {
      hasCustomerRecord: false,
      hasAdminRecord: false,
      hasAnyRecord: false,
    };
  }
};
