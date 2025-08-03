import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Select from "react-select";
import { supabase } from "../lib/supabaseClient";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);

  const materialOptions = ["Wood", "Metal", "Glass", "Plastic"].map((m) => ({
    value: m,
    label: m,
  }));
  const colorOptions = ["Black", "White", "Brown", "Gray"].map((c) => ({
    value: c,
    label: c,
  }));
  const sizeOptions = ["Small", "Medium", "Large", "Extra Large"].map((s) => ({
    value: s,
    label: s,
  }));

  // Fetch product on load
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error.message);
      } else {
        setProduct(data);
        setMaterials(data.materials ? [{ value: data.materials, label: data.materials }] : []);
        setColors(data.colors?.map((c) => ({ value: c, label: c })) || []);
        setSizes(data.sizes?.map((s) => ({ value: s, label: s })) || []);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = {
      ...product,
      materials: materials.length ? materials.map((m) => m.value).join(", ") : null,
      colors: colors.map((c) => c.value),
      sizes: sizes.map((s) => s.value),
    };

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Failed to update product:", error.message);
      alert("Update failed!");
    } else {
      alert("Product updated!");
      navigate("/products");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6 text-red-500">Product not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Edit Product (ID: {id})
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Editable Text Fields */}
          {[
            { label: "Product Name", key: "name" },
            { label: "Description", key: "description" },
            { label: "Price (GHS)", key: "price" },
            { label: "Stock Quantity", key: "stock_quantity" },
            { label: "Category ID", key: "category_id" },
            { label: "Subcategory ID", key: "subcategory_id" },
            { label: "Image URL", key: "image_url" },
            { label: "Status", key: "status" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
                {label}
              </label>
              <input
                type={key === "price" || key === "stock_quantity" ? "number" : "text"}
                value={product[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>
          ))}

          {/* Multi-select Dropdowns */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
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
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
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
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
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
            className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded-lg font-medium shadow transition duration-200"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
