import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Footer from '../components/footer';
import Header from '../components/header';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabase/supabaseClient';

const StarRating = ({ rating }) => (
  <div className="text-yellow-500 text-xs">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="w-full max-w-[170px] group cursor-pointer">
      <div className="bg-white rounded-lg overflow-hidden relative shadow hover:shadow-lg transition-shadow duration-300">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
       
        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Add to Inquiry Cart
        </button>

      </div>
      <div className="pt-2 text-xs">
        <p className="truncate font-medium">{product.name}</p>
        <StarRating rating={product.rating || 4} />
        <p className="text-green-700 font-semibold text-sm">GH₵{product.price}</p>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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

  const loadProducts = async (reset = false) => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*')
      .range((page - 1) * 10, page * 10 - 1);

    if (selectedCategory !== 'All') {
      const matchedCategory = categories.find((c) => c.name === selectedCategory);
      if (matchedCategory) query = query.eq('category_id', matchedCategory.id);
    }

    const { data, error } = await query;

    if (!error) {
      setProducts((prev) => (reset ? data : [...prev, ...data]));
      setPage((prev) => prev + 1);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts(true); // Reset products on category change
  }, [selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-[#E4E7EB] text-gray-900">
      <Header />

      <div className="flex flex-col lg:flex-row px-4 md:px-6 py-8 gap-6 flex-1">
        {/* Sidebar */}
        <aside className="w-full lg:w-[240px] text-sm">
          <h2 className="font-semibold mb-3">Categories</h2>
          <ul className="mb-6 space-y-2">
            <li
              onClick={() => setSelectedCategory('All')}
              className={`cursor-pointer hover:underline ${
                selectedCategory === 'All' ? 'font-bold text-green-700' : ''
              }`}
            >
              All Products
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <div
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`cursor-pointer flex items-center justify-between hover:underline ${
                    selectedCategory === cat.name ? 'font-bold text-green-700' : ''
                  }`}
                >
                  {cat.name}
                  {subcategories[cat.id]?.length > 0 && <ChevronDown className="w-4 h-4" />}
                </div>
                {subcategories[cat.id]?.length > 0 && selectedCategory === cat.name && (
                  <ul className="pl-4 mt-1 space-y-1 text-xs text-gray-600">
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
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <h2 className="text-xl font-semibold mb-1">{selectedCategory}</h2>
          <p className="text-xs text-gray-600 mb-6">
            Explore our quality office furniture collection.
          </p>
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
            {loading && <p className="text-center mt-4 text-sm text-gray-500">Loading...</p>}
            {!loading && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => loadProducts()}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-sm rounded shadow"
                >
                  Load More
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
