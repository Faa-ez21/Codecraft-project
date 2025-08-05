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
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const materialOptions = ["Wood", "Metal", "Glass", "Plastic"].map((m) => ({
    value: m,
    label: m,
  }));
  const colorOptions = ["Black", "White", "Brown", "Gray"].map((c) => ({
    value: c,
    label: c,
  }));

  const isValidUUID = (uuid) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);

  useEffect(() => {
    const fetchData = async () => {
      if (!isValidUUID(id)) {
        console.error("Invalid UUID format:", id);
        setLoading(false);
        return;
      }

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      const { data: categoryData } = await supabase
        .from("categories")
        .select("id, name");

      const { data: subcategoryData } = await supabase
        .from("subcategories")
        .select("id, name");

      if (productError) {
        console.error("Error fetching product:", productError.message);
      } else {
        setProduct(productData);
        setMaterials(
          Array.isArray(productData.materials)
            ? productData.materials.map((m) => ({ value: m, label: m }))
            : []
        );
        setColors(
          Array.isArray(productData.colors)
            ? productData.colors.map((c) => ({ value: c, label: c }))
            : []
        );
      }

      setCategories(categoryData || []);
      setSubcategories(subcategoryData || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = {
      ...product,
      materials: materials.map((m) => m.value),
      colors: colors.map((c) => c.value),
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
  if (!product) return <p className="p-6 text-red-500">Product not found or invalid ID.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Edit Product (ID: {id})
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Product Name", key: "name" },
            { label: "Description", key: "description" },
            { label: "Price (GHS)", key: "price" },
            { label: "Stock Quantity", key: "stock_quantity" },
            { label: "Quantity", key: "quantity" },
            { label: "Image URL", key: "image_url" },
            { label: "SKU", key: "sku" },
            { label: "Status", key: "status" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
                {label}
              </label>
              <input
                type={
                  key === "price" ||
                  key === "stock_quantity" ||
                  key === "quantity"
                    ? "number"
                    : "text"
                }
                value={product[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>
          ))}

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Category
            </label>
            <Select
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              value={categories
                .map((c) => ({ value: c.id, label: c.name }))
                .find((opt) => opt.value === product.category_id) || null}
              onChange={(selected) =>
                handleChange("category_id", selected.value)
              }
            />
          </div>

          {/* Subcategory Select */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Subcategory
            </label>
            <Select
              options={subcategories.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
              value={subcategories
                .map((s) => ({ value: s.id, label: s.name }))
                .find((opt) => opt.value === product.subcategory_id) || null}
              onChange={(selected) =>
                handleChange("subcategory_id", selected.value)
              }
            />
          </div>

          {/* Material Multi-select */}
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

          {/* Color Multi-select */}
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
