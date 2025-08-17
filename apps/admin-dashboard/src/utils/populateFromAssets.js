// Utility to populate database with categories, subcategories, and products from asset folder structure
import { supabase } from "../lib/supabaseClient";

// Product information mapping with accurate names and descriptions
const PRODUCT_INFO = {
  // Executive Desk Products
  "enhance this image.... put in an office scene (1).png": {
    name: "Premium Executive Office Desk in Scene",
    description:
      "High-end executive desk styled in a professional office environment. Features premium wood finish and spacious work surface ideal for executive offices.",
  },
  "image.png": {
    name: "Executive Desk - Standard View",
    description:
      "Classic executive desk with elegant design. Perfect for professional offices with ample workspace and built-in storage solutions.",
  },
  "IMG-20250508-WA0093.jpg": {
    name: "Executive Office Desk - Model WA0093",
    description:
      "Professional executive desk with modern design features. Built for durability and style in executive office settings.",
  },
  "IMG-20250508-WA0165.jpg": {
    name: "Executive Desk - Model WA0165",
    description:
      "Sophisticated executive desk with premium finish. Designed for high-level professionals requiring spacious work areas.",
  },
  "KB-D0120-SX1.jpg": {
    name: "KB Executive Desk Model D0120-SX1",
    description:
      "Premium KB series executive desk with superior build quality. Features elegant design with functional storage compartments.",
  },
  "KB-D0320-SX1.jpg": {
    name: "KB Executive Desk Model D0320-SX1",
    description:
      "Large executive desk from KB collection. Offers extensive workspace with professional aesthetics and durable construction.",
  },
  "KB-D0320-SX2.jpg": {
    name: "KB Executive Desk Model D0320-SX2",
    description:
      "Alternative view of KB D0320 executive desk. Showcases versatile design suitable for various office layouts.",
  },

  // Metal Cabinet Products
  "4d Fireproof.jpg": {
    name: "4-Drawer Fireproof Metal Cabinet",
    description:
      "Heavy-duty fireproof metal filing cabinet with 4 drawers. Provides secure storage for important documents with fire-resistant construction.",
  },
  "4Drawer light-grey.jpg": {
    name: "4-Drawer Light Grey Metal Cabinet",
    description:
      "Modern 4-drawer metal filing cabinet in light grey finish. Perfect for office document storage with sleek contemporary design.",
  },
  "DD cabinet..jpg": {
    name: "Double Door Metal Storage Cabinet",
    description:
      "Spacious double-door metal cabinet for general office storage. Features adjustable shelves and secure locking mechanism.",
  },
  "go-double-door.jpg": {
    name: "GO Series Double Door Cabinet",
    description:
      "Professional double-door storage cabinet from GO series. Ideal for office supplies and equipment storage with modern styling.",
  },
  "SLIDING CABINET GLASS.jpg": {
    name: "Sliding Glass Door Metal Cabinet",
    description:
      "Premium metal cabinet with sliding glass doors. Combines security with visibility for displaying and storing office materials.",
  },

  // Rectangular Desk Products
  "Copilot_20250723_140510.png": {
    name: "Modern Rectangular Office Desk",
    description:
      "Contemporary rectangular desk with clean lines and functional design. Perfect for modern office spaces requiring efficient workspace solutions.",
  },
  "_MG_6974.JPG": {
    name: "Rectangular Desk - Professional Model",
    description:
      "Professional-grade rectangular desk with robust construction. Ideal for daily office use with spacious work surface.",
  },

  // Sofa Products
  "_OS_0231.jpg": {
    name: "Office Sofa Model OS-0231",
    description:
      "Comfortable office sofa with professional upholstery. Perfect for reception areas and executive lounges.",
  },
  "_OS_0242.jpg": {
    name: "Office Sofa Model OS-0242",
    description:
      "Elegant office seating solution with premium fabric. Designed for comfort in professional waiting areas.",
  },
  "_OS_0254.jpg": {
    name: "Office Sofa Model OS-0254",
    description:
      "Stylish office sofa with modern design elements. Combines comfort with professional aesthetics.",
  },

  // SWIVEL Chair Products
  "EF839LC (2).JPG": {
    name: "EF839LC Canteen Chair",
    description:
      "Durable canteen chair with ergonomic design. Perfect for cafeteria and dining areas with easy-clean surfaces.",
  },
  "EF839LC (3).JPG": {
    name: "EF839LC Canteen Chair - Alternative View",
    description:
      "Additional view of EF839LC canteen chair showcasing versatile design and practical functionality.",
  },
  "_MG_8869.JPG": {
    name: "Premium Canteen Chair",
    description:
      "High-quality canteen seating with sturdy construction. Designed for high-traffic dining environments.",
  },

  // Ergonomic Swivel Chairs
  "591976431d0cc.jpg": {
    name: "Ergonomic Executive Chair - Premium Series",
    description:
      "High-end ergonomic chair with advanced lumbar support. Features premium materials and adjustable settings.",
  },
  "BRSS-HBM-L.jpg": {
    name: "BRSS High-Back Mesh Chair - Large",
    description:
      "Professional mesh office chair with high back support. Offers excellent ventilation and ergonomic comfort.",
  },
  "EHPL-AB-HAM.jpg": {
    name: "EHPL Adjustable Ergonomic Chair",
    description:
      "Fully adjustable ergonomic chair with advanced features. Designed for extended office use with superior comfort.",
  },

  // Lecture Hall Chairs
  "chair with tab ergo.jpg": {
    name: "Lecture Chair with Writing Tablet",
    description:
      "Ergonomic lecture hall chair with integrated writing tablet. Perfect for educational institutions and training rooms.",
  },
  "classroom desk.jpg": {
    name: "Classroom Lecture Desk",
    description:
      "Functional classroom desk designed for lecture halls. Combines seating with workspace for educational environments.",
  },
  "lecture hall chair+table.png": {
    name: "Lecture Hall Chair and Table Set",
    description:
      "Complete lecture hall seating solution with attached table. Ideal for universities and conference facilities.",
  },

  // Orthopedic Chairs
  "A46H-15.jpg": {
    name: "A46H Orthopedic Chair Model 15",
    description:
      "Therapeutic orthopedic chair designed for back support. Features specialized ergonomic design for health-conscious users.",
  },
  "A68.jpeg": {
    name: "A68 Orthopedic Office Chair",
    description:
      "Medical-grade orthopedic chair with superior lumbar support. Recommended for users with back concerns.",
  },
  "EF0983HA.jpg": {
    name: "EF0983HA Orthopedic Chair",
    description:
      "Advanced orthopedic chair with health-focused design. Provides optimal spine alignment and pressure relief.",
  },

  // Teller Chairs
  "BOO8-1.JPG": {
    name: "BOO8 Teller Chair",
    description:
      "Professional teller chair designed for banking environments. Features height adjustment and comfort for extended use.",
  },
  "ND-254.JPG": {
    name: "ND Teller Chair Model 254",
    description:
      "Ergonomic teller chair with professional styling. Perfect for customer service desks and reception areas.",
  },
  "ND-497.JPG": {
    name: "ND Teller Chair Model 497",
    description:
      "Premium teller chair with enhanced comfort features. Designed for professional customer service environments.",
  },

  // Visitors Chairs
  "EF0603VAL (2).JPG": {
    name: "EF0603VAL Visitor Chair",
    description:
      "Elegant visitor chair with comfortable seating. Perfect for reception areas and meeting rooms.",
  },
  "_MG_8889.JPG": {
    name: "Premium Visitor Chair",
    description:
      "High-quality visitor seating with professional appearance. Combines comfort with sophisticated design.",
  },

  // Wooden Cabinet Products
  "KB-S0308-SX.jpg": {
    name: "KB Wooden Storage Cabinet S0308-SX",
    description:
      "Premium wooden storage cabinet with elegant finish. Provides ample storage with traditional craftsmanship.",
  },
  "WhatsApp Image 2025-07-21 at 9.33.34 AM.jpeg": {
    name: "Wooden Cabinet - Executive Series",
    description:
      "Executive wooden cabinet with premium wood finish. Features multiple compartments for organized storage.",
  },
};

// Generate product name from filename if not in mapping
const generateProductName = (filename, categoryName) => {
  if (PRODUCT_INFO[filename]) {
    return PRODUCT_INFO[filename].name;
  }

  // Fallback: Generate from filename
  return filename
    .replace(/\.(png|jpg|jpeg|gif|webp)$/i, "")
    .replace(/[_\-()]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
};

// Generate product description from filename if not in mapping
const generateProductDescription = (
  filename,
  categoryName,
  subcategoryName = null
) => {
  if (PRODUCT_INFO[filename]) {
    return PRODUCT_INFO[filename].description;
  }

  // Fallback: Generate description
  const productName = generateProductName(filename, categoryName);
  const category = subcategoryName || categoryName;
  return `Professional ${category.toLowerCase()} - ${productName}. High-quality office furniture designed for modern workplace environments with attention to both functionality and aesthetic appeal.`;
};

// Folder structure mapping from the 25 Website directory
const ASSET_STRUCTURE = {
  "executive desk": {
    subcategories: [],
    products: [
      "enhance this image.... put in an office scene (1).png",
      "image.png",
      "IMG-20250508-WA0093.jpg",
      "IMG-20250508-WA0165.jpg",
      "KB-D0120-SX1.jpg",
      "KB-D0320-SX1.jpg",
      "KB-D0320-SX2.jpg",
    ],
  },
  "metal cabinet": {
    subcategories: [],
    products: [
      "4d Fireproof.jpg",
      "4Drawer light-grey.jpg",
      "DD cabinet..jpg",
      "go-double-door.jpg",
      "SLIDING CABINET GLASS.jpg",
    ],
  },
  "rectangular desk": {
    subcategories: [],
    products: [
      "Copilot_20250723_140510.png",
      "enhance the uploaded image.png",
      "IMG-20250508-WA0010.jpg",
      "IMG-20250508-WA0082.jpg",
      "IMG-20250508-WA0083.jpg",
      "IMG-20250508-WA0087.jpg",
      "IMG-20250508-WA0174.jpg",
      "_MG_6974.JPG",
    ],
  },
  sofa: {
    subcategories: [],
    products: [
      "image (1).png",
      "image.png",
      "_OS_0231.jpg",
      "_OS_0242.jpg",
      "_OS_0254.jpg",
    ],
  },
  SWIVEL: {
    subcategories: [
      {
        name: "canteen chairs",
        products: [
          "EF839LC (2).JPG",
          "EF839LC (3).JPG",
          "IMG-20240409-WA0011(1).jpg",
          "_MG_8869.JPG",
        ],
      },
      {
        name: "ERGONOMIC SWIVEL CHAIR",
        products: [
          "591976431d0cc.jpg",
          "BRSS-HBM-L.jpg",
          "EHPL-AB-HAM.jpg",
          "EHS-HAL (2).JPG",
          "EHS-HAL.jpg",
          "EJS-HAL ENJOY..jpg",
          "EJS-HAM.L.jpg",
          "EXPERT FURNISH LOGO.jpg",
          "GNS-AB-LA-H.JPG",
        ],
      },
      {
        name: "Lecture hall chair",
        products: [
          "chair with tab ergo.jpg",
          "classroom desk.jpg",
          "EF-55.JPG",
          "EF-66.JPG",
          "EF-67.JPG",
          "IMG-20180801-WA0023.jpg",
          "lecture hall chair+table.png",
          "SKEP-B-LAM-H-PW-FS (2).JPG",
          "_MG_9148(1).JPG",
        ],
      },
      {
        name: "ORTHOPEDIC CHAIRS",
        products: [
          "A46H-15.jpg",
          "A68.jpeg",
          "A71-10.jpg",
          "A96.JPG",
          "EF0983HA.jpg",
        ],
      },
      {
        name: "Standard swivel chair.leather and mesh",
        products: [
          "398.jpg",
          "CANDY EF0306ML.jpg",
          "DW-8303-A.jpg",
          "EF 0603MAL.jpg",
          "EF0398MN.JPG",
          "EF0603HAL..jpg",
          "EF0612MN (4).JPG",
          "EF0612MN.JPG",
          "image.png",
          "KIT511.jpg",
          "kit830-1.jpg",
          "ND-206.JPG",
          "ND-275.JPG",
          "ND-447.JPG",
          "ND-452.JPG",
          "ND-454.JPG",
          "WhatsApp Image 2024-09-04 at 13.43.49.jpeg",
          "_MG_8533.JPG",
        ],
      },
      {
        name: "teller chair",
        products: [
          "BOO8-1.JPG",
          "ND-254.JPG",
          "ND-255.JPG",
          "ND-261.JPG",
          "ND-497.JPG",
        ],
      },
      {
        name: "Visitors chair",
        products: [
          "EF0603VAL (2).JPG",
          "ND-519.JPG",
          "WhatsApp Image 2025-02-06 at 13.50.17.jpeg",
          "WhatsApp Image 2025-02-06 at 13.50.40 (2).jpeg",
          "WhatsApp Image 2025-02-06 at 13.53.39 (1).jpeg",
          "WhatsApp Image 2025-07-23 at 15.43.15.jpeg",
          "WhatsApp Image 2025-07-25 at 11.24.03.jpeg",
          "_MG_8889.JPG",
        ],
      },
    ],
    products: [],
  },
  "wooden cabinet": {
    subcategories: [],
    products: [
      "Copilot_20250723_130130.png",
      "Copilot_20250723_132903.png",
      "IMG-20250508-WA0030.jpg",
      "IMG-20250508-WA0032.jpg",
      "KB-S0308-SX.jpg",
      "WhatsApp Image 2025-07-21 at 9.33.34 AM.jpeg",
    ],
  },
};

export const populateFromAssets = async () => {
  try {
    console.log("Starting asset population...");

    // Helper function to add delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // 1. First, create all categories
    for (const [categoryName, categoryData] of Object.entries(
      ASSET_STRUCTURE
    )) {
      console.log(`Creating category: ${categoryName}`);

      // Check if category already exists
      const { data: existingCategory, error: checkError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", categoryName)
        .single();

      let categoryId;

      if (existingCategory) {
        categoryId = existingCategory.id;
        console.log(
          `Category "${categoryName}" already exists with ID: ${categoryId}`
        );
      } else {
        // Create new category
        const { data: newCategory, error: categoryError } = await supabase
          .from("categories")
          .insert([
            {
              name: categoryName,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (categoryError) {
          console.error(
            `Error creating category "${categoryName}":`,
            categoryError
          );
          continue;
        }

        categoryId = newCategory.id;
        console.log(
          `Created category "${categoryName}" with ID: ${categoryId}`
        );
      }

      // 2. Create subcategories if they exist
      if (categoryData.subcategories && categoryData.subcategories.length > 0) {
        for (const subcategoryData of categoryData.subcategories) {
          // Handle both string subcategories and object subcategories with products
          const subcategoryName =
            typeof subcategoryData === "string"
              ? subcategoryData
              : subcategoryData.name;
          const subcategoryProducts =
            typeof subcategoryData === "object" ? subcategoryData.products : [];

          console.log(
            `Creating subcategory: ${subcategoryName} under ${categoryName}`
          );

          // Check if subcategory already exists
          const { data: existingSubcategory, error: subCheckError } =
            await supabase
              .from("subcategories")
              .select("id")
              .eq("name", subcategoryName)
              .eq("category_id", categoryId)
              .single();

          let subcategoryId;

          if (existingSubcategory) {
            subcategoryId = existingSubcategory.id;
            console.log(
              `Subcategory "${subcategoryName}" already exists with ID: ${subcategoryId}`
            );
          } else {
            // Create new subcategory
            const { data: newSubcategory, error: subcategoryError } =
              await supabase
                .from("subcategories")
                .insert([
                  {
                    name: subcategoryName,
                    category_id: categoryId,
                    created_at: new Date().toISOString(),
                  },
                ])
                .select()
                .single();

            if (subcategoryError) {
              console.error(
                `Error creating subcategory "${subcategoryName}":`,
                subcategoryError
              );
              continue;
            }

            subcategoryId = newSubcategory.id;
            console.log(
              `Created subcategory "${subcategoryName}" with ID: ${subcategoryId}`
            );
          }

          // 3. Create products for this subcategory if they exist
          if (subcategoryProducts && subcategoryProducts.length > 0) {
            for (const productFile of subcategoryProducts) {
              // Generate accurate product name and description
              const productName = generateProductName(
                productFile,
                categoryName
              );
              const productDescription = generateProductDescription(
                productFile,
                categoryName,
                subcategoryName
              );

              console.log(
                `Creating product: ${productName} in subcategory: ${subcategoryName}`
              );

              // Check if product already exists
              const { data: existingProduct, error: productCheckError } =
                await supabase
                  .from("products")
                  .select("id")
                  .eq("name", productName)
                  .eq("category_id", categoryId)
                  .eq("subcategory_id", subcategoryId)
                  .single();

              if (existingProduct) {
                console.log(
                  `Product "${productName}" already exists in subcategory`
                );
                continue;
              }

              // Create new product
              const productData = {
                name: productName,
                description: productDescription,
                price: generateRandomPrice(categoryName),
                category_id: categoryId,
                subcategory_id: subcategoryId,
                image_url: `/assets/25 Website/${categoryName}/${subcategoryName}/${productFile}`,
                additional_images: [],
                materials: [
                  ["Wood"],
                  ["Metal"],
                  ["Fabric"],
                  ["Leather"],
                  ["Plastic"],
                ][Math.floor(Math.random() * 5)],
                colors: [["Brown"], ["Black"], ["White"], ["Gray"], ["Blue"]][
                  Math.floor(Math.random() * 5)
                ],
                stock_quantity: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
                sku: generateSKU(categoryName, productName),
                status: "active",
                created_at: new Date().toISOString(),
              };

              const { data: newProduct, error: productError } = await supabase
                .from("products")
                .insert([productData])
                .select()
                .single();

              if (productError) {
                console.error(
                  `Error creating product "${productName}":`,
                  productError
                );
                // Continue with next product instead of stopping
                continue;
              }

              console.log(
                `Created product "${productName}" with ID: ${newProduct.id}`
              );

              // Small delay to prevent overwhelming the database
              await delay(50);
            }
          }
        }
      }

      // 4. Create products for main category if they exist
      if (categoryData.products && categoryData.products.length > 0) {
        for (const productFile of categoryData.products) {
          // Generate accurate product name and description
          const productName = generateProductName(productFile, categoryName);
          const productDescription = generateProductDescription(
            productFile,
            categoryName
          );

          console.log(`Creating product: ${productName}`);

          // Check if product already exists
          const { data: existingProduct, error: productCheckError } =
            await supabase
              .from("products")
              .select("id")
              .eq("name", productName)
              .eq("category_id", categoryId)
              .single();

          if (existingProduct) {
            console.log(`Product "${productName}" already exists`);
            continue;
          }

          // Create new product
          const productData = {
            name: productName,
            description: productDescription,
            price: generateRandomPrice(categoryName),
            category_id: categoryId,
            subcategory_id: null, // Will be updated if needed
            image_url: `/assets/25 Website/${categoryName}/${productFile}`,
            additional_images: [],
            materials: [
              ["Wood"],
              ["Metal"],
              ["Fabric"],
              ["Leather"],
              ["Plastic"],
            ][Math.floor(Math.random() * 5)],
            colors: [["Brown"], ["Black"], ["White"], ["Gray"], ["Blue"]][
              Math.floor(Math.random() * 5)
            ],
            stock_quantity: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
            sku: generateSKU(categoryName, productName),
            status: "active",
            created_at: new Date().toISOString(),
          };

          const { data: newProduct, error: productError } = await supabase
            .from("products")
            .insert([productData])
            .select()
            .single();

          if (productError) {
            console.error(
              `Error creating product "${productName}":`,
              productError
            );
            // Continue with next product instead of stopping
            continue;
          }

          console.log(
            `Created product "${productName}" with ID: ${newProduct.id}`
          );

          // Small delay to prevent overwhelming the database
          await delay(50);
        }
      }

      // Delay between categories
      await delay(100);
    }

    console.log("Asset population completed successfully!");
    return {
      success: true,
      message: "Categories, subcategories, and products created successfully",
    };
  } catch (error) {
    console.error("Error during asset population:", error);
    return { success: false, message: `Error: ${error.message}` };
  }
};

// Helper function to generate random prices based on category
const generateRandomPrice = (categoryName) => {
  const priceRanges = {
    "executive desk": { min: 800, max: 2500 },
    "metal cabinet": { min: 300, max: 800 },
    "rectangular desk": { min: 400, max: 1200 },
    sofa: { min: 1200, max: 3500 },
    SWIVEL: { min: 150, max: 600 },
    "wooden cabinet": { min: 500, max: 1500 },
  };

  const range = priceRanges[categoryName] || { min: 200, max: 1000 };
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

// Helper function to generate SKU
const generateSKU = (categoryName, productName) => {
  const categoryCode = categoryName.substring(0, 3).toUpperCase();
  const productCode = productName
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  const randomNum = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");

  return `${categoryCode}-${productCode}-${randomNum}`;
};

export default populateFromAssets;
