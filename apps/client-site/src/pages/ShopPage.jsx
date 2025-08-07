import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Footer from '../components/footer';
import Header from '../components/header';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabase/supabaseClient';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative w-full bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => addToCart(product)}
          className="bg-green-700 hover:bg-green-800 text-white text-xs px-3 py-2 rounded-full shadow"
        >
          Add to Inquiry Cart
        </button>
      </div>
      <div className="p-3 text-center">
        <h3 className="text-sm font-semibold truncate">{product.name}</h3>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [expandedCats, setExpandedCats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [filters, setFilters] = useState({ material: '', color: '', inStock: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const loadCategories = async () => {
    const { data: catData } = await supabase.from('categories').select('*');
    const { data: subData } = await supabase.from('subcategories').select('*');
    const groupedSub = subData.reduce((acc, curr) => {
      acc[curr.category_id] = acc[curr.category_id] || [];
      acc[curr.category_id].push(curr);
      return acc;
    }, {});
    setCategories(catData || []);
    setSubcategories(groupedSub);
  };

  const loadFilterOptions = async () => {
    const { data: matData } = await supabase.from('products').select('materials');
    const { data: colData } = await supabase.from('products').select('colors');
    setMaterials([...new Set(matData.flatMap(item => item.materials || []))]);
    setColors([...new Set(colData.flatMap(item => item.colors || []))]);
  };

  const loadProducts = async (reset = false) => {
    let query = supabase.from('products').select('*');

    if (selectedCategory !== 'All') {
      const matchedCategory = categories.find((c) => c.name === selectedCategory);
      const matchedSub = Object.values(subcategories).flat().find((s) => s.name === selectedCategory);
      if (matchedCategory) query = query.eq('category_id', matchedCategory.id);
      else if (matchedSub) query = query.eq('subcategory_id', matchedSub.id);
    }

    if (filters.material) query = query.contains('materials', [filters.material]);
    if (filters.color) query = query.contains('colors', [filters.color]);
    if (filters.inStock) query = query.gt('stock_quantity', 0);
    if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);

    query = query.range((page - 1) * 10, page * 10 - 1);

    const { data, error } = await query;
    if (!error) {
      if (reset) {
        setProducts(data);
        setPage(2);
      } else {
        setProducts((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
      setHasMore(data.length === 10);
    }
  };

  const lastProductRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, selectedCategory, filters, searchTerm]
  );

  useEffect(() => {
    loadCategories();
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadProducts(true);
  }, [selectedCategory, filters, searchTerm]);

  const toggleCategoryExpand = (catId) => {
    setExpandedCats((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-gray-900">
      <Header />

      <div className="flex flex-col lg:flex-row px-4 md:px-10 py-8 gap-10 flex-1">
        {/* Sidebar */}
        <aside className="w-full lg:w-[260px] bg-white rounded-xl shadow p-5 text-sm">
          <h2 className="font-semibold mb-4 text-lg text-gray-800">Shop Filters</h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Categories */}
          <ul className="space-y-3 mb-6">
            <li
              onClick={() => setSelectedCategory('All')}
              className={`cursor-pointer px-2 py-1 rounded hover:bg-green-50 ${
                selectedCategory === 'All' ? 'font-bold text-green-700' : ''
              }`}
            >
              All Products
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <div
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    toggleCategoryExpand(cat.id);
                  }}
                  className={`flex items-center justify-between cursor-pointer px-2 py-1 rounded hover:bg-green-50 ${
                    selectedCategory === cat.name ? 'font-bold text-green-700' : ''
                  }`}
                >
                  {cat.name}
                  {subcategories[cat.id]?.length > 0 &&
                    (expandedCats[cat.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </div>
                {expandedCats[cat.id] && subcategories[cat.id]?.length > 0 && (
                  <ul className="pl-4 mt-2 space-y-2 text-xs text-gray-600">
                    {subcategories[cat.id].map((sub) => (
                      <li
                        key={sub.id}
                        onClick={() => setSelectedCategory(sub.name)}
                        className={`cursor-pointer hover:text-green-700 ${
                          selectedCategory === sub.name ? 'text-green-700 font-semibold' : ''
                        }`}
                      >
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Filters */}
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium">Material</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.material}
              onChange={(e) => setFilters({ ...filters, material: e.target.value })}
            >
              <option value="">All</option>
              {materials.map((mat) => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium">Color</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.color}
              onChange={(e) => setFilters({ ...filters, color: e.target.value })}
            >
              <option value="">All</option>
              {colors.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="stock"
              checked={filters.inStock}
              onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
            />
            <label htmlFor="stock" className="text-sm">Only show in-stock</label>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1 capitalize">{selectedCategory}</h2>
            <p className="text-sm text-gray-500">Explore our quality office furniture collection.</p>
          </div>

          <section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((item, index) =>
                index === products.length - 1 ? (
                  <div ref={lastProductRef} key={item.id}>
                    <ProductCard product={item} />
                  </div>
                ) : (
                  <ProductCard key={item.id} product={item} />
                )
              )}
            </div>

            {!hasMore && (
              <p className="text-center mt-10 text-sm text-gray-400">You've reached the end 🎉</p>
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
