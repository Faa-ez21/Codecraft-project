import { supabase } from "../supabase/supabaseClient.js";
import { seedSampleProducts } from "./sampleDataSeeder.js";

// Debug function to check products in the database
export const debugProducts = async () => {
  console.log("🔍 Debug: Checking products in database...");

  try {
    // Check total products count
    const { data: allProducts, error: allError } = await supabase
      .from("products")
      .select("*");

    if (allError) {
      console.error("❌ Error fetching all products:", allError);
      return;
    }

    console.log("📊 Total products in database:", allProducts?.length || 0);

    // If no products, offer to seed sample data
    if (!allProducts || allProducts.length === 0) {
      console.log("📦 No products found! Would you like to seed sample data?");
      console.log("🌱 Attempting to seed sample products...");

      try {
        const seedResult = await seedSampleProducts();
        if (seedResult.success) {
          console.log("✅ Sample products seeded successfully!");
          // Re-check products after seeding
          const { data: newProducts } = await supabase
            .from("products")
            .select("*");
          console.log("📊 Products after seeding:", newProducts?.length || 0);
          return newProducts;
        } else {
          console.error("❌ Failed to seed sample products:", seedResult.error);
        }
      } catch (seedError) {
        console.error("❌ Error during seeding:", seedError);
      }
      return [];
    }

    if (allProducts && allProducts.length > 0) {
      console.log("📦 Sample products:");
      allProducts.slice(0, 5).forEach((product) => {
        console.log(
          `  - ${product.name} (ID: ${product.id}, Category: ${product.category_id}, Status: ${product.status})`
        );
      });

      // Check categories
      const uniqueCategories = [
        ...new Set(allProducts.map((p) => p.category_id)),
      ];
      console.log("🏷️ Unique category IDs:", uniqueCategories);

      // Check status distribution
      const statusCounts = allProducts.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {});
      console.log("📈 Status distribution:", statusCounts);
    }

    // Check categories table
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*");

    if (catError) {
      console.error("❌ Error fetching categories:", catError);
    } else {
      console.log("🏷️ Categories in database:", categories?.length || 0);
      categories?.forEach((cat) => {
        console.log(`  - ${cat.name} (ID: ${cat.id})`);
      });
    }

    // Check subcategories table
    const { data: subcategories, error: subError } = await supabase
      .from("subcategories")
      .select("*");

    if (subError) {
      console.error("❌ Error fetching subcategories:", subError);
    } else {
      console.log("🏷️ Subcategories in database:", subcategories?.length || 0);
    }

    return {
      totalProducts: allProducts?.length || 0,
      categories: categories?.length || 0,
      subcategories: subcategories?.length || 0,
      products: allProducts,
    };
  } catch (error) {
    console.error("❌ Debug error:", error);
    return null;
  }
};

// Test a specific query similar to what RelatedProducts uses
export const testRelatedProductsQuery = async (
  categoryId = null,
  limit = 4
) => {
  console.log("🧪 Testing RelatedProducts query...");
  console.log("Parameters:", { categoryId, limit });

  try {
    let query = supabase.from("products").select("*");

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query.eq("status", "active").limit(limit);

    if (error) {
      console.error("❌ Query error:", error);
      return [];
    }

    console.log("✅ Query result:", data?.length || 0, "products");
    data?.forEach((product) => {
      console.log(`  - ${product.name} (Category: ${product.category_id})`);
    });

    return data || [];
  } catch (error) {
    console.error("❌ Test query error:", error);
    return [];
  }
};
