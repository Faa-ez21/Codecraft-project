// src/pages/EditDiscount.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function EditDiscount() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    code: "",
    discount_type: "",
    discount_value: "",
    start_date: "",
    end_date: "",
    product_ids: [],
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load discount and product list
  useEffect(() => {
    const fetchData = async () => {
      const [{ data: discount, error: discountError }, { data: productList }] = await Promise.all([
        supabase.from("discounts").select("*").eq("id", id).single(),
        supabase.from("products").select("id, name"),
      ]);

      if (discountError) {
        setError("Failed to load discount");
        setLoading(false);
        return;
      }

      const { data: mappings } = await supabase
        .from("discount_products")
        .select("product_id")
        .eq("discount_id", id);

      const selectedProductIds = mappings?.map((m) => m.product_id) || [];

      setForm({
        name: discount.name,
        code: discount.code,
        discount_type: discount.discount_type,
        discount_value: discount.discount_value,
        start_date: discount.start_date?.split("T")[0],
        end_date: discount.end_date?.split("T")[0],
        product_ids: selectedProductIds,
      });

      setProducts(productList);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm((prev) => ({ ...prev, product_ids: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      name,
      code,
      discount_type,
      discount_value,
      start_date,
      end_date,
      product_ids,
    } = form;

    const { error: updateError } = await supabase
      .from("discounts")
      .update({
        name,
        code,
        discount_type: discount_type.toLowerCase(),
        discount_value: parseFloat(discount_value),
        start_date,
        end_date,
      })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Clear and re-insert product mappings
    await supabase.from("discount_products").delete().eq("discount_id", id);

    if (product_ids.length > 0) {
      const mappings = product_ids.map((pid) => ({
        discount_id: id,
        product_id: pid,
      }));
      await supabase.from("discount_products").insert(mappings);
    }

    navigate("/discounts");
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow rounded-xl">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Edit Discount
      </h1>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Name & Code */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
            placeholder="Discount Name"
          />
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
            placeholder="Discount Code"
          />
        </div>

        {/* Type & Value */}
        <div className="grid grid-cols-2 gap-4">
          <select
            name="discount_type"
            value={form.discount_type}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Type</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>

          <input
            name="discount_value"
            type="number"
            value={form.discount_value}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
            placeholder="Value"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
        </div>

        {/* Product Selection */}
        <div>
          <label className="block font-medium mb-1">Apply to Products (optional)</label>
          <select
            multiple
            value={form.product_ids}
            onChange={handleProductSelect}
            className="w-full border px-3 py-2 rounded h-40"
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
          </p>
        </div>

        {/* Error and Submit */}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Discount"}
        </button>
      </form>
    </div>
  );
}
