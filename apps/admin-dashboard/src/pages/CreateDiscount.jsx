// src/pages/CreateDiscount.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function CreateDiscount() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateUUID = () => crypto.randomUUID(); // 👈 random UUID generator

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("id, name");
      if (error) console.error("Failed to fetch products:", error);
      else setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProductSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm((prev) => ({ ...prev, product_ids: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      name,
      code,
      discount_type,
      discount_value,
      start_date,
      end_date,
      product_ids,
    } = form;

    const discountId = generateUUID(); // 👈 generate random id for discount

    // Insert into discounts
    const { error: discountError } = await supabase.from("discounts").insert([
      {
        id: discountId,
        name,
        code,
        discount_type,
        discount_value: parseFloat(discount_value),
        start_date,
        end_date,
        status: "Active",
        created_at: new Date().toISOString(),
      },
    ]);

    if (discountError) {
      setError(discountError.message);
      setLoading(false);
      return;
    }

    // Insert into discount_products if selected
    if (product_ids.length > 0) {
      const mappings = product_ids.map((pid) => ({
        id: generateUUID(),
        discount_id: discountId,
        product_id: pid,
      }));

      const { error: mappingError } = await supabase.from("discount_products").insert(mappings);

      if (mappingError) {
        setError(mappingError.message);
        setLoading(false);
        return;
      }
    }

    navigate("/discounts");
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow rounded-xl">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Create Discount
      </h1>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Name & Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Summer Sale"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Code</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              placeholder="SUMMER20"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Type & Value */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select
              name="discount_type"
              value={form.discount_type}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select</option>
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Value</label>
            <input
              name="discount_value"
              type="number"
              value={form.discount_value}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. 20"
            />
          </div>
        </div>

        {/* Start & End */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Start Date</label>
            <input
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Product selection */}
        <div>
          <label className="block mb-1 font-medium">Apply to Products (optional)</label>
          <select
            multiple
            name="product_ids"
            value={form.product_ids}
            onChange={handleProductSelect}
            className="w-full border px-3 py-2 rounded h-40"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
          </p>
        </div>

        {/* Submit */}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Creating..." : "Create Discount"}
        </button>
      </form>
    </div>
  );
}
