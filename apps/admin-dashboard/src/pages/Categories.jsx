import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState("");

  // ✅ Load categories and subcategories on mount
  useEffect(() => {
    const fetchData = async () => {
      const { data: cats, error: catErr } = await supabase.from("categories").select("*");
      const { data: subs, error: subErr } = await supabase.from("subcategories").select("*");

      if (catErr || subErr) {
        console.error("Error fetching data:", catErr?.message || subErr?.message);
        return;
      }

      const joined = cats.map((cat) => ({
        ...cat,
        subcategories: subs.filter((sub) => sub.category_id === cat.id),
      }));

      setCategories(joined);
    };

    fetchData();
  }, []);

  // ✅ Add Category to Supabase
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const { data, error } = await supabase.from("categories").insert([
      {
        name: newCategory.trim(),
        created_at: new Date().toISOString(),
      },
    ]).select();

    if (error) {
      console.error("Add category failed:", error.message);
      return;
    }

    setCategories((prev) => [...prev, { ...data[0], subcategories: [] }]);
    setNewCategory("");
  };

  // ✅ Add Subcategory to Supabase
  const handleAddSubCategory = async () => {
    if (!selectedCategoryId || !newSubCategory.trim()) return;

    const { data, error } = await supabase.from("subcategories").insert([
      {
        name: newSubCategory.trim(),
        category_id: selectedCategoryId,
        created_at: new Date().toISOString(),
      },
    ]).select();

    if (error) {
      console.error("Add subcategory failed:", error.message);
      return;
    }

    const newSub = data[0];

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategoryId
          ? { ...cat, subcategories: [...cat.subcategories, newSub] }
          : cat
      )
    );
    setNewSubCategory("");
  };

  // ✅ Delete Category from Supabase
  const handleDeleteCategory = async (id) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      console.error("Delete category failed:", error.message);
      return;
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // ✅ Delete Subcategory from Supabase
  const handleDeleteSubCategory = async (catId, subId) => {
    const { error } = await supabase.from("subcategories").delete().eq("id", subId);
    if (error) {
      console.error("Delete subcategory failed:", error.message);
      return;
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              subcategories: cat.subcategories.filter((sub) => sub.id !== subId),
            }
          : cat
      )
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Categories Management
      </h1>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3"
        />
        <button
          onClick={handleAddCategory}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {cat.name}
              </h2>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-red-500 hover:text-red-600"
                title="Delete Category"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <ul className="ml-4 text-gray-700 dark:text-gray-300 space-y-1 mb-4">
              {cat.subcategories.map((sub) => (
                <li key={sub.id} className="flex justify-between items-center text-sm">
                  <span>{sub.name}</span>
                  <button
                    onClick={() => handleDeleteSubCategory(cat.id, sub.id)}
                    className="text-red-400 hover:text-red-500"
                    title="Delete Subcategory"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-3 mt-2">
              <input
                type="text"
                placeholder="New Subcategory"
                value={selectedCategoryId === cat.id ? newSubCategory : ""}
                onChange={(e) => {
                  setSelectedCategoryId(cat.id);
                  setNewSubCategory(e.target.value);
                }}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2"
              />
              <button
                onClick={handleAddSubCategory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
