import { useState, useEffect } from "react";
import Select from "react-select";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 0,
    sku: "",
    status: "In Stock",
    price: "",
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data: categories } = await supabase.from("categories").select("id, name");
      const { data: subcategories } = await supabase.from("subcategories").select("id, name, category_id");

      setCategoryOptions(categories.map((cat) => ({ value: cat.id, label: cat.name })));
      setSubcategoryOptions(subcategories);
    };
    fetchCategories();
  }, []);

  // Image file preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let imageUrl = "";
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        setMessage("❌ Image upload failed.");
        setLoading(false);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      imageUrl = publicData.publicUrl;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price || 0),
      stock_quantity: parseInt(formData.quantity),
      image_url: imageUrl,
      category_id: selectedCategory?.value || null,
      subcategory_id: selectedSubcategory?.value || null,
      materials: materials.map((m) => m.value),
      colors: colors.map((c) => c.value),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("products").insert([productData]);
    if (error) {
      console.error("Insert error:", error.message);
      setMessage("❌ Failed to add product.");
    } else {
      setMessage("✅ Product added successfully.");
      // Optionally reset the form here
    }

    setLoading(false);
  };

  const materialOptions = ["Wood", "Metal", "Glass", "Plastic"].map((v) => ({ value: v, label: v }));
  const colorOptions = ["Black", "White", "Brown", "Gray"].map((v) => ({ value: v, label: v }));

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Product Image
          </label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-32 object-cover rounded border"
            />
          )}
        </div>

        {/* Input Fields */}
        {[
          { label: "Product Name", name: "name" },
          { label: "Description", name: "description" },
          { label: "Quantity", name: "quantity", type: "number" },
          { label: "SKU", name: "sku" },
          { label: "Status", name: "status" },
          { label: "Price (GHS)", name: "price", type: "number" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              required
            />
          </div>
        ))}

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Category
          </label>
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={(cat) => {
              setSelectedCategory(cat);
              setSelectedSubcategory(null);
            }}
          />
        </div>

        {/* Subcategory Select */}
        {selectedCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Subcategory
            </label>
            <Select
              options={subcategoryOptions
                .filter((sub) => sub.category_id === selectedCategory.value)
                .map((sub) => ({ value: sub.id, label: sub.name }))}
              value={selectedSubcategory}
              onChange={setSelectedSubcategory}
            />
          </div>
        )}

        {/* Multi-selects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Material
          </label>
          <Select isMulti options={materialOptions} value={materials} onChange={setMaterials} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Color
          </label>
          <Select isMulti options={colorOptions} value={colors} onChange={setColors} />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded font-medium"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>

        {message && <p className="text-sm mt-2 text-blue-600 dark:text-green-400">{message}</p>}
      </form>
    </div>
  );
}
