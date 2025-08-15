import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Select from "react-select";
import { supabase } from "../lib/supabaseClient";
import { uploadImage } from "../lib/imageUpload";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const materialOptions = ["Wood", "Metal", "Glass", "Plastic"].map((m) => ({ value: m, label: m }));
  const colorOptions = ["Black", "White", "Brown", "Gray"].map((c) => ({ value: c, label: c }));

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

      const { data: categoryData } = await supabase.from("categories").select("id, name");
      const { data: subcategoryData } = await supabase.from("subcategories").select("id, name");

      if (!productError) {
        setProduct(productData);
        setMaterials(Array.isArray(productData.materials) ? productData.materials.map((m) => ({ value: m, label: m })) : []);
        setColors(Array.isArray(productData.colors) ? productData.colors.map((c) => ({ value: c, label: c })) : []);
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

    const image_url = imageFile ? await uploadImage(imageFile) : product.image_url;

    const updates = {
      ...product,
      image_url,
      materials: materials.map((m) => m.value),
      colors: colors.map((c) => c.value),
    };

    const { error } = await supabase.from("products").update(updates).eq("id", id);

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
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Product (ID: {id})</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Product Name", key: "name" },
            { label: "Description", key: "description" },
            { label: "Price (GHS)", key: "price" },
            { label: "Stock Quantity", key: "stock_quantity" },
            { label: "Quantity", key: "quantity" },
            { label: "SKU", key: "sku" },
            { label: "Status", key: "status" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-1">{label}</label>
              <input
                type={key.includes("price") || key.includes("quantity") ? "number" : "text"}
                value={product[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
              />
            </div>
          ))}

          <div>
            <label>Category</label>
            <Select options={categories.map((c) => ({ value: c.id, label: c.name }))} value={categories.map((c) => ({ value: c.id, label: c.name })).find((opt) => opt.value === product.category_id) || null} onChange={(selected) => handleChange("category_id", selected.value)} />
          </div>

          <div>
            <label>Subcategory</label>
            <Select options={subcategories.map((s) => ({ value: s.id, label: s.name }))} value={subcategories.map((s) => ({ value: s.id, label: s.name })).find((opt) => opt.value === product.subcategory_id) || null} onChange={(selected) => handleChange("subcategory_id", selected.value)} />
          </div>

          <div>
            <label>Material</label>
            <Select isMulti options={materialOptions} value={materials} onChange={setMaterials} />
          </div>

          <div>
            <label>Color</label>
            <Select isMulti options={colorOptions} value={colors} onChange={setColors} />
          </div>

          <div>
            <label>Product Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full" />
          </div>

          <button type="submit" className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded-lg">Update Product</button>
        </form>
      </div>
    </div>
  );
}
