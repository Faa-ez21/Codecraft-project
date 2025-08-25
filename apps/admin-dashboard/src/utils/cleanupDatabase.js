// Utility to clean up all products, subcategories, and categories from the database
import { supabase } from "../lib/supabaseClient";

/**
 * Removes all products, subcategories, and categories from the database
 * This will completely clean the database for fresh manual entry
 */
export async function cleanupDatabase() {
  try {
    console.log("Starting database cleanup...");

    // Step 1: Delete all order items first (due to foreign key constraints)
    console.log("Deleting all order items...");

    // Get all order items first
    const { data: orderItems, error: fetchOrderItemsError } = await supabase
      .from("order_items")
      .select("id");

    if (
      fetchOrderItemsError &&
      fetchOrderItemsError.code !== "42P01" &&
      fetchOrderItemsError.code !== "PGRST205"
    ) {
      console.error("Error fetching order items:", fetchOrderItemsError);
      throw fetchOrderItemsError;
    }

    if (
      fetchOrderItemsError &&
      (fetchOrderItemsError.code === "42P01" ||
        fetchOrderItemsError.code === "PGRST205")
    ) {
      console.log("✅ Order items table doesn't exist - skipping");
    } else if (orderItems && orderItems.length > 0) {
      const { error: orderItemsError } = await supabase
        .from("order_items")
        .delete()
        .in(
          "id",
          orderItems.map((item) => item.id)
        );

      if (orderItemsError) {
        console.error("Error deleting order items:", orderItemsError);
        throw orderItemsError;
      }
      console.log(`✅ Deleted ${orderItems.length} order items successfully`);
    } else {
      console.log("✅ No order items to delete");
    }

    // Step 2: Delete all orders (if any exist)
    console.log("Deleting all orders...");

    const { data: orders, error: fetchOrdersError } = await supabase
      .from("orders")
      .select("id");

    if (
      fetchOrdersError &&
      fetchOrdersError.code !== "42P01" &&
      fetchOrdersError.code !== "PGRST205"
    ) {
      console.error("Error fetching orders:", fetchOrdersError);
      throw fetchOrdersError;
    }

    if (
      fetchOrdersError &&
      (fetchOrdersError.code === "42P01" ||
        fetchOrdersError.code === "PGRST205")
    ) {
      console.log("✅ Orders table doesn't exist - skipping");
    } else if (orders && orders.length > 0) {
      const { error: ordersError } = await supabase
        .from("orders")
        .delete()
        .in(
          "id",
          orders.map((order) => order.id)
        );

      if (ordersError) {
        console.error("Error deleting orders:", ordersError);
        throw ordersError;
      }
      console.log(`✅ Deleted ${orders.length} orders successfully`);
    } else {
      console.log("✅ No orders to delete");
    }

    // Step 3: Delete all cart items (if any exist)
    console.log("Deleting all cart items...");

    const { data: cartItems, error: fetchCartItemsError } = await supabase
      .from("cart_items")
      .select("id");

    if (
      fetchCartItemsError &&
      fetchCartItemsError.code !== "42P01" &&
      fetchCartItemsError.code !== "PGRST205"
    ) {
      console.error("Error fetching cart items:", fetchCartItemsError);
      throw fetchCartItemsError;
    }

    if (
      fetchCartItemsError &&
      (fetchCartItemsError.code === "42P01" ||
        fetchCartItemsError.code === "PGRST205")
    ) {
      console.log("✅ Cart items table doesn't exist - skipping");
    } else if (cartItems && cartItems.length > 0) {
      const { error: cartItemsError } = await supabase
        .from("cart_items")
        .delete()
        .in(
          "id",
          cartItems.map((item) => item.id)
        );

      if (cartItemsError) {
        console.error("Error deleting cart items:", cartItemsError);
        throw cartItemsError;
      }
      console.log(`✅ Deleted ${cartItems.length} cart items successfully`);
    } else {
      console.log("✅ No cart items to delete");
    }

    // Step 4: Delete all products (now that references are gone)
    console.log("Deleting all products...");

    const { data: products, error: fetchProductsError } = await supabase
      .from("products")
      .select("id");

    if (fetchProductsError) {
      console.error("Error fetching products:", fetchProductsError);
      throw fetchProductsError;
    }

    if (products && products.length > 0) {
      const { error: productsError } = await supabase
        .from("products")
        .delete()
        .in(
          "id",
          products.map((product) => product.id)
        );

      if (productsError) {
        console.error("Error deleting products:", productsError);
        throw productsError;
      }
      console.log(`✅ Deleted ${products.length} products successfully`);
    } else {
      console.log("✅ No products to delete");
    }

    // Step 5: Delete all subcategories (due to foreign key constraints)
    console.log("Deleting all subcategories...");

    const { data: subcategories, error: fetchSubcategoriesError } =
      await supabase.from("subcategories").select("id");

    if (fetchSubcategoriesError) {
      console.error("Error fetching subcategories:", fetchSubcategoriesError);
      throw fetchSubcategoriesError;
    }

    if (subcategories && subcategories.length > 0) {
      const { error: subcategoriesError } = await supabase
        .from("subcategories")
        .delete()
        .in(
          "id",
          subcategories.map((sub) => sub.id)
        );

      if (subcategoriesError) {
        console.error("Error deleting subcategories:", subcategoriesError);
        throw subcategoriesError;
      }
      console.log(
        `✅ Deleted ${subcategories.length} subcategories successfully`
      );
    } else {
      console.log("✅ No subcategories to delete");
    }

    // Step 6: Delete all categories
    console.log("Deleting all categories...");

    const { data: categories, error: fetchCategoriesError } = await supabase
      .from("categories")
      .select("id");

    if (fetchCategoriesError) {
      console.error("Error fetching categories:", fetchCategoriesError);
      throw fetchCategoriesError;
    }

    if (categories && categories.length > 0) {
      const { error: categoriesError } = await supabase
        .from("categories")
        .delete()
        .in(
          "id",
          categories.map((cat) => cat.id)
        );

      if (categoriesError) {
        console.error("Error deleting categories:", categoriesError);
        throw categoriesError;
      }
      console.log(`✅ Deleted ${categories.length} categories successfully`);
    } else {
      console.log("✅ No categories to delete");
    }

    console.log("🎉 Database cleanup completed successfully!");
    console.log("The database is now clean and ready for manual entry.");

    return { success: true, message: "Database cleaned successfully" };
  } catch (error) {
    console.error("❌ Database cleanup failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get counts of current database records
 */
export async function getDatabaseCounts() {
  try {
    // Count order items
    const { count: orderItemCount, error: orderItemError } = await supabase
      .from("order_items")
      .select("*", { count: "exact", head: true });

    // Count orders
    const { count: orderCount, error: orderError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    // Count cart items
    const { count: cartItemCount, error: cartItemError } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true });

    // Count products
    const { count: productCount, error: productError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (productError) throw productError;

    // Count subcategories
    const { count: subcategoryCount, error: subcategoryError } = await supabase
      .from("subcategories")
      .select("*", { count: "exact", head: true });

    if (subcategoryError) throw subcategoryError;

    // Count categories
    const { count: categoryCount, error: categoryError } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    if (categoryError) throw categoryError;

    return {
      orderItems:
        orderItemError &&
        (orderItemError.code === "42P01" || orderItemError.code === "PGRST205")
          ? 0
          : orderItemCount || 0,
      orders:
        orderError &&
        (orderError.code === "42P01" || orderError.code === "PGRST205")
          ? 0
          : orderCount || 0,
      cartItems:
        cartItemError &&
        (cartItemError.code === "42P01" || cartItemError.code === "PGRST205")
          ? 0
          : cartItemCount || 0,
      products: productCount || 0,
      subcategories: subcategoryCount || 0,
      categories: categoryCount || 0,
    };
  } catch (error) {
    console.error("Error getting database counts:", error);
    return {
      orderItems: 0,
      orders: 0,
      cartItems: 0,
      products: 0,
      subcategories: 0,
      categories: 0,
    };
  }
}

/**
 * Confirm cleanup with user (for safety)
 */
export async function confirmAndCleanup() {
  // Get current counts
  const counts = await getDatabaseCounts();

  console.log("\n📊 Current Database Status:");
  console.log(`Order Items: ${counts.orderItems}`);
  console.log(`Orders: ${counts.orders}`);
  console.log(`Cart Items: ${counts.cartItems}`);
  console.log(`Categories: ${counts.categories}`);
  console.log(`Subcategories: ${counts.subcategories}`);
  console.log(`Products: ${counts.products}`);
  console.log(
    `Total Records: ${
      counts.orderItems +
      counts.orders +
      counts.cartItems +
      counts.categories +
      counts.subcategories +
      counts.products
    }`
  );

  const totalRecords =
    counts.orderItems +
    counts.orders +
    counts.cartItems +
    counts.categories +
    counts.subcategories +
    counts.products;

  if (totalRecords === 0) {
    console.log("✅ Database is already empty!");
    return { success: true, message: "Database is already clean" };
  }

  console.log(
    "\n⚠️  WARNING: This will permanently delete ALL order data, categories, subcategories, and products!"
  );
  console.log("This action cannot be undone.");

  // In a real application, you'd want user confirmation here
  // For now, we'll proceed with the cleanup
  return await cleanupDatabase();
}
