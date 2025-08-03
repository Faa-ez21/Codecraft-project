import { useState } from "react";
import Select from "react-select";
import { supabase } from "../lib/supabaseClient"; // adjust path as needed
import { v4 as uuidv4 } from "uuid";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 0,
    category_id: "",
    subcategory_id: "",
    weight: "",
    dimensions: "",
    sku: "",
    barcode: "",
    status: "In Stock",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let imageUrl = "";

    // Upload image to Supabase Storage if file is selected
    if (imageFile) {
      const fileName = `${uuidv4()}-${imageFile.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("product-images") // bucket name
        .upload(fileName, imageFile);

      if (uploadError) {
        setMessage("Image upload failed");
        setLoading(false);
        return;
      }

      const { data: publicURL } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      imageUrl = publicURL.publicUrl;
    }

    // Prepare data for insertion
    const productData = {
      ...formData,
      price: parseFloat(formData.price || 0),
      stock_quantity: parseInt(formData.quantity),
      materials: materials.map((m) => m.value).join(", "),
      colors: colors.map((c) => c.value),
      sizes: sizes.map((s) => s.value),
      image_url: imageUrl,
    };

    // Insert into Supabase
    const { error } = await supabase.from("products").insert([productData]);
    if (error) {
      console.error("Insert error:", error.message);
      setMessage("Failed to add product.");
    } else {
      setMessage("Product added successfully.");
    }

    setLoading(false);
  };

  const materialOptions = ["Wood", "Metal", "Glass", "Plastic"].map((v) => ({
    value: v,
    label: v,
  }));

  const colorOptions = ["Black", "White", "Brown", "Gray"].map((v) => ({
    value: v,
    label: v,
  }));

  const sizeOptions = ["Small", "Medium", "Large", "Extra Large"].map((v) => ({
    value: v,
    label: v,
  }));

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
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

        {/* Text Inputs */}
        {[
          { label: "Product Name", name: "name" },
          { label: "Description", name: "description" },
          { label: "Quantity", name: "quantity", type: "number" },
          { label: "Category ID", name: "category_id" },
          { label: "Subcategory ID", name: "subcategory_id" },
          { label: "Weight", name: "weight" },
          { label: "Dimensions", name: "dimensions" },
          { label: "SKU", name: "sku" },
          { label: "Barcode", name: "barcode" },
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
              placeholder={`Enter ${label.toLowerCase()}`}
              className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              required
            />
          </div>
        ))}

        {/* Multi-select Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Material
          </label>
          <Select
            isMulti
            options={materialOptions}
            value={materials}
            onChange={setMaterials}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Color
          </label>
          <Select
            isMulti
            options={colorOptions}
            value={colors}
            onChange={setColors}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Size
          </label>
          <Select
            isMulti
            options={sizeOptions}
            value={sizes}
            onChange={setSizes}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded font-medium"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
        {message && <p className="text-sm mt-2 text-blue-600">{message}</p>}
      </form>
    </div>
  );
}
