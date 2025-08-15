import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { uploadImage } from "../lib/imageUpload";
import "react-toastify/dist/ReactToastify.css";

export default function AddProduct({ productId = null }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    subcategory: "",
    image_url: "",
    materials: [],
    colors: [],
    sku: uuidv4().slice(0, 8),
    status: "active",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (productId) {
      fetchProductData(productId);
    }
  }, [productId]);

  const fetchCategories = async () => {
    const { data: cats, error } = await supabase.from("categories").select("*");
    if (!error) setCategories(cats);
  };

  const fetchProductData = async (id) => {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
    if (data && !error) {
      setForm({
        ...data,
        category: data.category_id,
        subcategory: data.subcategory_id,
        materials: data.materials || [],
        colors: data.colors || [],
      });
    } else {
      toast.error("Error fetching product.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const image_url = imageFile ? await uploadImage(imageFile) : form.image_url;

      const productPayload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        image_url,
        materials: form.materials,
        colors: form.colors,
        category_id: form.category,
        subcategory_id: form.subcategory,
        sku: form.sku || uuidv4().slice(0, 8),
        status: form.status || "active",
        created_at: new Date().toISOString(),
      };

      if (productId) {
        const { error } = await supabase
          .from("products")
          .update(productPayload)
          .eq("id", productId);
        if (error) throw error;
        toast.success("Product updated!");
      } else {
        const { error } = await supabase.from("products").insert([productPayload]);
        if (error) throw error;
        toast.success("Product added!");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSubcategories = async () => {
      const selectedCategory = form.category;
      if (selectedCategory) {
        const { data: subcats } = await supabase
          .from("subcategories")
          .select("*")
          .eq("category_id", selectedCategory);
        setSubcategories(subcats);
      }
    };

    if (form.category) {
      fetchSubcategories();
    } else {
      setSubcategories([]);
    }
  }, [form.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name, values) => {
    setForm((prev) => ({
      ...prev,
      [name]: values.split(",").map((v) => v.trim()),
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{productId ? "Edit" : "Add"} Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="w-full border px-3 py-2" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border px-3 py-2" required />
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full border px-3 py-2" required />
        <input type="number" name="stock_quantity" value={form.stock_quantity} onChange={handleChange} placeholder="Stock Quantity" className="w-full border px-3 py-2" required />
        <select name="category" value={form.category} onChange={handleChange} className="w-full border px-3 py-2" required>
          <option value="">Select Category</option>
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <select name="subcategory" value={form.subcategory} onChange={handleChange} className="w-full border px-3 py-2" required>
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
        </select>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full" />
        <input type="text" placeholder="Materials (comma-separated)" value={form.materials.join(", ")} onChange={(e) => handleMultiSelectChange("materials", e.target.value)} className="w-full border px-3 py-2" />
        <input type="text" placeholder="Colors (comma-separated)" value={form.colors.join(", ")} onChange={(e) => handleMultiSelectChange("colors", e.target.value)} className="w-full border px-3 py-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60" disabled={loading}>
          {loading ? "Saving..." : productId ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
