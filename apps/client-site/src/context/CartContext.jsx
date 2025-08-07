import { createContext, useContext, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ Add to cart
  const addToCart = (product) => {
    const exists = cartItems.find(item => item.id === product.id);
    if (exists) {
      setCartItems(prev =>
        prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCartItems(prev => [...prev, { ...product, qty: 1 }]);
    }
  };

  // ✅ Remove from cart
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Update quantity
  const updateQuantity = (id, action) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              qty: action === 'increase' ? item.qty + 1 : Math.max(1, item.qty - 1),
            }
          : item
      )
    );
  };

  // ✅ Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    clearCoupon();
  };

  // ✅ Apply coupon
  const applyCoupon = async (code) => {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('status', 'active')
      .maybeSingle();

    if (error || !data) {
      setErrorMessage('Invalid or expired coupon.');
      return false;
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (total < data.min_order_value) {
      setErrorMessage(`Minimum order value is $${data.min_order_value}`);
      return false;
    }

    let discount = 0;
    if (data.type === 'percentage') {
      discount = (data.value / 100) * total;
    } else if (data.type === 'fixed') {
      discount = data.value;
    }

    if (data.max_discount) {
      discount = Math.min(discount, data.max_discount);
    }

    setCoupon(data);
    setDiscountAmount(discount);
    setErrorMessage('');
    return true;
  };

  // ✅ Clear coupon
  const clearCoupon = () => {
    setCoupon(null);
    setDiscountAmount(0);
    setErrorMessage('');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        clearCoupon,
        coupon,
        discountAmount,
        errorMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Export custom hook
export const useCart = () => useContext(CartContext);
