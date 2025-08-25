// Utility script to clean up corrupted additional_images data
import { supabase } from "../lib/supabaseClient.js";

export const cleanupProductImages = async () => {
  console.log("Starting image cleanup...");

  try {
    // Fetch all products
    const { data: products, error } = await supabase
      .from("products")
      .select("id, additional_images, name");

    if (error) {
      console.error("Error fetching products:", error);
      return;
    }

    console.log(`Found ${products.length} products to check`);

    let cleanedCount = 0;

    for (const product of products) {
      let needsUpdate = false;
      let cleanedImages = [];

      console.log(`Checking product: ${product.name} (ID: ${product.id})`);
      console.log("Current additional_images:", product.additional_images);

      if (product.additional_images) {
        // If it's already an array, validate it
        if (Array.isArray(product.additional_images)) {
          cleanedImages = product.additional_images
            .filter((img) => typeof img === "string" && img.trim() !== "")
            .slice(0, 5); // Limit to 5 additional images

          // Check if the array is suspiciously long
          if (product.additional_images.length > 10) {
            console.warn(
              `Product ${product.name} has ${product.additional_images.length} images - cleaning`
            );
            needsUpdate = true;
          }
        } else if (typeof product.additional_images === "string") {
          // Try to parse as JSON
          try {
            const parsed = JSON.parse(product.additional_images);
            if (Array.isArray(parsed)) {
              cleanedImages = parsed
                .filter((img) => typeof img === "string" && img.trim() !== "")
                .slice(0, 5);
              needsUpdate = true;
            }
          } catch (e) {
            console.error(
              `Failed to parse additional_images for product ${product.name}:`,
              e
            );
            cleanedImages = [];
            needsUpdate = true;
          }
        }

        // Update if needed
        if (
          needsUpdate ||
          product.additional_images.length !== cleanedImages.length
        ) {
          console.log(
            `Updating product ${product.name} - cleaned ${product.additional_images.length} -> ${cleanedImages.length} images`
          );

          const { error: updateError } = await supabase
            .from("products")
            .update({ additional_images: cleanedImages })
            .eq("id", product.id);

          if (updateError) {
            console.error(
              `Error updating product ${product.name}:`,
              updateError
            );
          } else {
            cleanedCount++;
            console.log(`✓ Successfully cleaned product ${product.name}`);
          }
        }
      }
    }

    console.log(`✓ Cleanup complete! Cleaned ${cleanedCount} products.`);
    return { success: true, cleanedCount };
  } catch (error) {
    console.error("Error during cleanup:", error);
    return { success: false, error };
  }
};

// Function to manually run the cleanup (can be called from console)
window.cleanupProductImages = cleanupProductImages;
