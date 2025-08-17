import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Search,
  Filter,
  Tag,
  Folder,
  FolderOpen,
  TrendingUp,
  Package,
  Grid,
  List,
  MoreVertical,
  Edit3,
  Eye,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { populateFromAssets } from "../utils/populateFromAssets";
import { confirmAndCleanup, getDatabaseCounts } from "../utils/cleanupDatabase";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [isPopulating, setIsPopulating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: cats, error: catErr } = await supabase
      .from("categories")
      .select("*");
    const { data: subs, error: subErr } = await supabase
      .from("subcategories")
      .select("*");

    if (catErr || subErr) {
      console.error("Error fetching data:", catErr?.message || subErr?.message);
      setLoading(false);
      return;
    }

    const joined = (cats || []).map((cat) => ({
      ...cat,
      subcategories: (subs || []).filter((sub) => sub.category_id === cat.id),
    }));

    setCategories(joined);
    setLoading(false);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          name: newCategory.trim(),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Add category failed:", error.message);
      return;
    }

    setCategories((prev) => [...prev, { ...data[0], subcategories: [] }]);
    setNewCategory("");
  };

  const handleAddSubCategory = async () => {
    if (!selectedCategoryId || !newSubCategory.trim()) return;

    const { data, error } = await supabase
      .from("subcategories")
      .insert([
        {
          name: newSubCategory.trim(),
          category_id: selectedCategoryId,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

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
    setSelectedCategoryId(null);
  };

  const handleDeleteCategory = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category and all its subcategories?"
    );
    if (!confirmed) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      console.error("Delete category failed:", error.message);
      return;
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const handleDeleteSubCategory = async (catId, subId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subcategory?"
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", subId);
    if (error) {
      console.error("Delete subcategory failed:", error.message);
      return;
    }

    setCategories((prev) =>
      prev.map((cat) =>
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

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handlePopulateFromAssets = async () => {
    setIsPopulating(true);
    try {
      const result = await populateFromAssets();
      if (result.success) {
        alert("Categories and products populated successfully!");
        await fetchData(); // Refresh the data
      } else {
        alert(`Failed to populate: ${result.message}`);
      }
    } catch (error) {
      console.error("Error populating from assets:", error);
      alert(`Error: ${error.message}`);
    }
    setIsPopulating(false);
  };

  const handleCleanupDatabase = async () => {
    const counts = await getDatabaseCounts();
    const totalRecords =
      counts.orderItems +
      counts.orders +
      counts.cartItems +
      counts.categories +
      counts.subcategories +
      counts.products;

    if (totalRecords === 0) {
      alert("Database is already empty!");
      return;
    }

    const confirmed = window.confirm(
      `⚠️ WARNING: This will permanently delete ALL data!\n\n` +
        `Current Database:\n` +
        `• Order Items: ${counts.orderItems}\n` +
        `• Orders: ${counts.orders}\n` +
        `• Cart Items: ${counts.cartItems}\n` +
        `• Categories: ${counts.categories}\n` +
        `• Subcategories: ${counts.subcategories}\n` +
        `• Products: ${counts.products}\n` +
        `• Total Records: ${totalRecords}\n\n` +
        `This action cannot be undone. Are you sure?`
    );

    if (!confirmed) return;

    setIsCleaning(true);
    try {
      const result = await confirmAndCleanup();
      if (result.success) {
        alert(
          "Database cleaned successfully! You can now manually add categories and products."
        );
        await fetchData(); // Refresh the data
      } else {
        alert(`Failed to clean database: ${result.message}`);
      }
    } catch (error) {
      console.error("Error cleaning database:", error);
      alert(`Error: ${error.message}`);
    }
    setIsCleaning(false);
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.subcategories.some((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const stats = {
    totalCategories: categories.length,
    totalSubcategories: categories.reduce(
      (sum, cat) => sum + cat.subcategories.length,
      0
    ),
    avgSubcategories:
      categories.length > 0
        ? Math.round(
            categories.reduce((sum, cat) => sum + cat.subcategories.length, 0) /
              categories.length
          )
        : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Categories Management
              </h1>
              <p className="text-gray-600 mt-1">
                Organize your products with categories and subcategories
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            {
              title: "Total Categories",
              value: stats.totalCategories,
              icon: Folder,
              color: "from-blue-500 to-cyan-500",
              change: "+5%",
            },
            {
              title: "Subcategories",
              value: stats.totalSubcategories,
              icon: Tag,
              color: "from-green-500 to-emerald-500",
              change: "+12%",
            },
            {
              title: "Avg Per Category",
              value: stats.avgSubcategories,
              icon: TrendingUp,
              color: "from-purple-500 to-pink-500",
              change: "+8%",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-green-500 text-xs font-semibold mt-1">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Category Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Category Management
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handlePopulateFromAssets}
                disabled={isPopulating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold 
                         hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 
                         shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Package className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                {isPopulating ? "Populating..." : "Populate from Assets"}
              </button>
              <button
                onClick={handleCleanupDatabase}
                disabled={isCleaning}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold 
                         hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 
                         shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Trash2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                {isCleaning ? "Cleaning..." : "Clean Database"}
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              />
            </div>
            <button
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold 
                       hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 
                       shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add Category
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories and subcategories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              />
            </div>

            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "cards"
                    ? "bg-white shadow-sm text-green-600"
                    : "text-gray-500"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-green-600"
                    : "text-gray-500"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {viewMode === "cards" ? (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                        {expandedCategories.has(cat.id) ? (
                          <FolderOpen className="w-5 h-5 text-green-600" />
                        ) : (
                          <Folder className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {cat.subcategories.length} subcategories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        title={
                          expandedCategories.has(cat.id) ? "Collapse" : "Expand"
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.has(cat.id) && (
                    <div className="mb-4">
                      <div className="grid grid-cols-1 gap-2 mb-3">
                        {cat.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {sub.name}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteSubCategory(cat.id, sub.id)
                              }
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
                              title="Delete Subcategory"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Subcategory Form */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add subcategory..."
                        value={
                          selectedCategoryId === cat.id ? newSubCategory : ""
                        }
                        onChange={(e) => {
                          setSelectedCategoryId(cat.id);
                          setNewSubCategory(e.target.value);
                        }}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddSubCategory()
                        }
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-200 transition-all duration-200"
                      />
                      <button
                        onClick={handleAddSubCategory}
                        disabled={
                          selectedCategoryId !== cat.id ||
                          !newSubCategory.trim()
                        }
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Subcategories
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Count
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat, index) => (
                    <tr
                      key={cat.id}
                      className={`border-t border-gray-100 hover:bg-green-50/50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white/50" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                            <Folder className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-semibold text-gray-800">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {cat.subcategories.slice(0, 3).map((sub) => (
                            <span
                              key={sub.id}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {sub.name}
                            </span>
                          ))}
                          {cat.subcategories.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{cat.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-700 font-medium">
                          {cat.subcategories.length}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleCategory(cat.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <Folder className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">
                              No categories found
                            </p>
                            <p className="text-gray-400 text-sm">
                              Create your first category to get started
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
