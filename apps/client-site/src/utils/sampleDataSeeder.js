// Sample products data for Expert Office Furnish
import { supabase } from "../supabase/supabaseClient";

const sampleProducts = [
  // Executive Desks Category
  {
    name: "Executive Oak Desk",
    description:
      "Premium solid oak executive desk with spacious drawers and cable management system. Perfect for senior management offices.",
    category: "Desks",
    subcategory: "Executive Desks",
    materials: "Solid Oak Wood, Steel Hardware",
    colors: "Natural Oak, Dark Walnut",
    price: 1299.99,
    stock_quantity: 15,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    ],
  },
  {
    name: "Modern Glass Executive Desk",
    description:
      "Contemporary glass-top executive desk with chrome legs and built-in storage compartments.",
    category: "Desks",
    subcategory: "Executive Desks",
    materials: "Tempered Glass, Chrome Steel",
    colors: "Clear Glass, Frosted Glass",
    price: 899.99,
    stock_quantity: 12,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500",
    ],
  },
  {
    name: "L-Shaped Executive Workstation",
    description:
      "Spacious L-shaped executive desk with return and overhead storage. Ideal for corner offices.",
    category: "Desks",
    subcategory: "Executive Desks",
    materials: "Laminate, Steel Frame",
    colors: "Mahogany, Cherry, White",
    price: 1599.99,
    stock_quantity: 8,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [],
  },

  // Office Chairs Category
  {
    name: "Ergonomic Executive Chair",
    description:
      "Premium leather executive chair with lumbar support, adjustable armrests, and 360-degree swivel.",
    category: "Chairs",
    subcategory: "Executive Chairs",
    materials: "Genuine Leather, Steel Base",
    colors: "Black, Brown, White",
    price: 599.99,
    stock_quantity: 25,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    ],
  },
  {
    name: "Mesh Back Task Chair",
    description:
      "Breathable mesh task chair with adjustable height and tilt mechanism. Perfect for long work sessions.",
    category: "Chairs",
    subcategory: "Task Chairs",
    materials: "Mesh Fabric, Plastic Base",
    colors: "Black, Gray, Blue",
    price: 299.99,
    stock_quantity: 40,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500",
    ],
  },
  {
    name: "Conference Room Chair Set",
    description:
      "Set of 6 professional conference chairs with padded seats and chrome frames.",
    category: "Chairs",
    subcategory: "Conference Chairs",
    materials: "Fabric Upholstery, Chrome Steel",
    colors: "Navy, Gray, Burgundy",
    price: 1199.99,
    stock_quantity: 10,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [],
  },

  // Storage Category
  {
    name: "4-Drawer Filing Cabinet",
    description:
      "Heavy-duty steel filing cabinet with lock and anti-tip mechanism. Holds letter and legal size files.",
    category: "Storage",
    subcategory: "Filing Cabinets",
    materials: "Steel, Powder Coating",
    colors: "Black, White, Gray",
    price: 249.99,
    stock_quantity: 30,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500",
    ],
  },
  {
    name: "Open Bookshelf Unit",
    description:
      "5-shelf open bookshelf perfect for displaying books, binders, and decorative items.",
    category: "Storage",
    subcategory: "Bookcases",
    materials: "Engineered Wood, Metal Brackets",
    colors: "Oak, Walnut, White",
    price: 199.99,
    stock_quantity: 20,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [],
  },
  {
    name: "Mobile Storage Pedestal",
    description:
      "Compact mobile storage unit with wheels, perfect for under-desk organization.",
    category: "Storage",
    subcategory: "Pedestals",
    materials: "Steel, Casters",
    colors: "Black, Silver, White",
    price: 159.99,
    stock_quantity: 35,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500",
    ],
  },

  // Conference Tables Category
  {
    name: "12-Person Conference Table",
    description:
      "Large oval conference table accommodating up to 12 people. Features built-in cable management.",
    category: "Tables",
    subcategory: "Conference Tables",
    materials: "Laminate Top, Steel Base",
    colors: "Mahogany, Cherry, Maple",
    price: 2199.99,
    stock_quantity: 5,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    ],
  },
  {
    name: "Round Meeting Table",
    description:
      "Compact round meeting table for 4-6 people. Ideal for small conference rooms.",
    category: "Tables",
    subcategory: "Meeting Tables",
    materials: "Wood Veneer, Metal Base",
    colors: "Natural, Dark Wood, White",
    price: 699.99,
    stock_quantity: 12,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [],
  },

  // Accessories Category
  {
    name: "Adjustable Monitor Stand",
    description:
      "Ergonomic monitor stand with height and angle adjustment. Supports monitors up to 27 inches.",
    category: "Accessories",
    subcategory: "Monitor Stands",
    materials: "Aluminum, Plastic",
    colors: "Silver, Black",
    price: 79.99,
    stock_quantity: 50,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500",
    ],
  },
  {
    name: "Desk Organizer Set",
    description:
      "Complete desk organizer set with pen holders, paper trays, and small compartments.",
    category: "Accessories",
    subcategory: "Desk Organizers",
    materials: "Bamboo, Fabric Lining",
    colors: "Natural Bamboo, Dark Wood",
    price: 49.99,
    stock_quantity: 60,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [],
  },
  {
    name: "LED Desk Lamp",
    description:
      "Modern LED desk lamp with touch controls, USB charging port, and adjustable brightness.",
    category: "Accessories",
    subcategory: "Lighting",
    materials: "Aluminum, LED",
    colors: "Silver, Black, White",
    price: 89.99,
    stock_quantity: 45,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500",
    ],
  },

  // Reception Furniture
  {
    name: "Reception Desk with Hutch",
    description:
      "Professional reception desk with overhead hutch for storage and display.",
    category: "Reception",
    subcategory: "Reception Desks",
    materials: "Laminate, Steel Hardware",
    colors: "Maple, Cherry, White",
    price: 899.99,
    stock_quantity: 8,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [],
  },
  {
    name: "Waiting Area Sofa",
    description:
      "Comfortable 3-seat sofa for reception and waiting areas. Stain-resistant fabric.",
    category: "Reception",
    subcategory: "Seating",
    materials: "Fabric Upholstery, Wood Frame",
    colors: "Navy, Gray, Beige",
    price: 599.99,
    stock_quantity: 15,
    status: "active",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    additional_images: [
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500",
    ],
  },
];

// Categories and subcategories mapping
const categories = [
  {
    name: "Desks",
    subcategories: ["Executive Desks", "Task Desks", "Standing Desks"],
  },
  {
    name: "Chairs",
    subcategories: ["Executive Chairs", "Task Chairs", "Conference Chairs"],
  },
  {
    name: "Storage",
    subcategories: ["Filing Cabinets", "Bookcases", "Pedestals"],
  },
  {
    name: "Tables",
    subcategories: ["Conference Tables", "Meeting Tables", "Side Tables"],
  },
  {
    name: "Accessories",
    subcategories: ["Monitor Stands", "Desk Organizers", "Lighting"],
  },
  {
    name: "Reception",
    subcategories: ["Reception Desks", "Seating", "Coffee Tables"],
  },
];

export const seedSampleProducts = async () => {
  try {
    console.log("🌱 Starting to seed sample products...");

    // First, create categories and subcategories
    for (const category of categories) {
      // Insert category
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .upsert({ name: category.name }, { onConflict: "name" })
        .select()
        .single();

      if (categoryError) {
        console.error("Error inserting category:", categoryError);
        continue;
      }

      // Insert subcategories
      for (const subcategoryName of category.subcategories) {
        const { error: subcategoryError } = await supabase
          .from("subcategories")
          .upsert(
            {
              name: subcategoryName,
              category_id: categoryData.id,
            },
            { onConflict: "name,category_id" }
          );

        if (subcategoryError) {
          console.error("Error inserting subcategory:", subcategoryError);
        }
      }
    }

    console.log("✅ Categories and subcategories created");

    // Get all categories and subcategories for reference
    const { data: allCategories } = await supabase
      .from("categories")
      .select("*");
    const { data: allSubcategories } = await supabase
      .from("subcategories")
      .select("*");

    // Insert products
    let successCount = 0;
    for (const product of sampleProducts) {
      try {
        // Find category and subcategory IDs
        const category = allCategories.find((c) => c.name === product.category);
        const subcategory = allSubcategories.find(
          (s) =>
            s.name === product.subcategory && s.category_id === category?.id
        );

        if (!category || !subcategory) {
          console.error(
            `Category or subcategory not found for product: ${product.name}`
          );
          continue;
        }

        // Check if product already exists
        const { data: existingProduct } = await supabase
          .from("products")
          .select("id")
          .eq("name", product.name)
          .single();

        if (existingProduct) {
          console.log(`Product already exists: ${product.name}`);
          continue;
        }

        // Insert product
        const { data, error } = await supabase.from("products").insert({
          name: product.name,
          description: product.description,
          price: product.price,
          stock_quantity: product.stock_quantity,
          image_url: product.image_url,
          additional_images: product.additional_images,
          materials: product.materials,
          colors: product.colors,
          category_id: category.id,
          subcategory_id: subcategory.id,
          sku: `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          status: product.status,
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error(`Error inserting product ${product.name}:`, error);
        } else {
          successCount++;
          console.log(`✅ Created product: ${product.name}`);
        }
      } catch (error) {
        console.error(`Error processing product ${product.name}:`, error);
      }
    }

    console.log(
      `🎉 Successfully seeded ${successCount} out of ${sampleProducts.length} products!`
    );
    return { success: true, count: successCount };
  } catch (error) {
    console.error("Error seeding sample products:", error);
    return { success: false, error };
  }
};

// Function to add viewing behavior simulation
export const simulateUserBehavior = async (userId = "demo_user") => {
  try {
    console.log("🎭 Simulating user behavior...");

    // Get all products
    const { data: products } = await supabase.from("products").select("*");

    if (!products || products.length === 0) {
      console.log("No products found for behavior simulation");
      return;
    }

    // Simulate different user patterns
    const patterns = [
      {
        name: "Executive Office Seeker",
        interests: ["Executive Desks", "Executive Chairs", "Conference Tables"],
        viewCount: 15,
      },
      {
        name: "Home Office Worker",
        interests: [
          "Task Chairs",
          "Desk Organizers",
          "Monitor Stands",
          "Lighting",
        ],
        viewCount: 12,
      },
      {
        name: "Office Manager",
        interests: ["Filing Cabinets", "Conference Chairs", "Reception Desks"],
        viewCount: 10,
      },
    ];

    // Randomly select a pattern
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    console.log(`Simulating pattern: ${pattern.name}`);

    // Find products matching interests
    const relevantProducts = products.filter((product) =>
      pattern.interests.some(
        (interest) =>
          product.materials?.includes(interest) ||
          product.name.includes(interest.split(" ")[0])
      )
    );

    // Simulate views
    for (
      let i = 0;
      i < Math.min(pattern.viewCount, relevantProducts.length);
      i++
    ) {
      const product =
        relevantProducts[Math.floor(Math.random() * relevantProducts.length)];

      // Simulate multiple views over time
      const viewCount = Math.floor(Math.random() * 5) + 1;
      console.log(`Simulating ${viewCount} views for: ${product.name}`);
    }

    console.log("✅ User behavior simulation completed");
    return { success: true, pattern: pattern.name };
  } catch (error) {
    console.error("Error simulating user behavior:", error);
    return { success: false, error };
  }
};

export default {
  seedSampleProducts,
  simulateUserBehavior,
  sampleProducts,
  categories,
};
