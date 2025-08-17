import { supabase } from "../supabase/supabaseClient";

/**
 * Get all users from both auth and database
 */
export const getAllUsers = async () => {
  try {
    // Get customers from database
    const { data: customers, error: customersError } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (customersError) {
      console.error("Error fetching customers:", customersError);
    }

    // Get admins from database
    const { data: admins, error: adminsError } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (adminsError) {
      console.error("Error fetching admins:", adminsError);
    }

    return {
      customers: customers || [],
      admins: admins || [],
    };
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return { customers: [], admins: [] };
  }
};

/**
 * Delete a user from auth (admin only)
 */
export const deleteAuthUser = async (userId) => {
  try {
    // This requires admin privileges on Supabase
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Error deleting auth user:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteAuthUser:", error);
    return false;
  }
};

/**
 * Delete a customer from database
 */
export const deleteCustomer = async (customerId) => {
  try {
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", customerId);

    if (error) {
      console.error("Error deleting customer:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteCustomer:", error);
    return false;
  }
};

/**
 * Delete an admin from database
 */
export const deleteAdmin = async (adminId) => {
  try {
    const { error } = await supabase.from("users").delete().eq("id", adminId);

    if (error) {
      console.error("Error deleting admin:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteAdmin:", error);
    return false;
  }
};

/**
 * Create missing customer record
 */
export const createMissingCustomerRecord = async (user) => {
  try {
    const { error } = await supabase.from("customers").insert([
      {
        id: user.id,
        name: user.user_metadata?.name || user.email.split("@")[0],
        email: user.email,
        phone: "",
        location: "",
        orders: 0,
        spent: 0,
      },
    ]);

    if (error) {
      console.error("Error creating missing customer record:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in createMissingCustomerRecord:", error);
    return false;
  }
};
