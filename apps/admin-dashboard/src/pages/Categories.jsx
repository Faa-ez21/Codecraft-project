// src/pages/Categories.jsx
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Desks",
      subcategories: [
        { id: 11, name: "Executive Desk" },
        { id: 12, name: "Rectangular Desk" },
      ],
    },
    {
      id: 2,
      name: "Cabinets",
      subcategories: [
        { id: 21, name: "Wooden Cabinet" },
        { id: 22, name: "Metal Cabinet" },
      ],
    },
    {
      id: 3,
      name: "Chairs",
      subcategories: [{ id: 31, name: "Swivel Chair" }],
    },
    {
      id: 4,
      name: "Sofa",
      subcategories: [],
    },
  ]);

  const [newCategory, setNewCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const newId = Date.now();
    setCategories([
      ...categories,
      { id: newId, name: newCategory, subcategories: [] },
    ]);
    setNewCategory("");
  };

  const handleAddSubCategory = () => {
    if (!selectedCategoryId || !newSubCategory.trim()) return;

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategoryId
          ? {
              ...cat,
              subcategories: [
                ...cat.subcategories,
                { id: Date.now(), name: newSubCategory },
              ],
            }
          : cat
      )
    );
    setNewSubCategory("");
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleDeleteSubCategory = (catId, subId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              subcategories: cat.subcategories.filter(
                (sub) => sub.id !== subId
              ),
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

      {/* Add Category */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleAddCategory}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Categories List */}
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

            {/* Subcategories */}
            <ul className="ml-4 text-gray-700 dark:text-gray-300 space-y-1 mb-4">
              {cat.subcategories.map((sub) => (
                <li
                  key={sub.id}
                  className="flex justify-between items-center text-sm"
                >
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

            {/* Add Subcategory */}
            <div className="flex gap-3 mt-2">
              <input
                type="text"
                placeholder="New Subcategory"
                value={selectedCategoryId === cat.id ? newSubCategory : ""}
                onChange={(e) => {
                  setSelectedCategoryId(cat.id);
                  setNewSubCategory(e.target.value);
                }}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
