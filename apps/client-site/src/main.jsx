import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/home';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';
import CartPage from './pages/CartPage';
import OurServicesPage from './pages/OurServices';
import InteriorDecor from './pages/InteriorDecor';
import Gallery from './pages/Gallery';
import ProductInquiry from './pages/InquiryPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext'; // <- new import
import ProductPage from './pages/ProductPage';
import NewsletterForm from './pages/NewsletterForm';

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <div className="text-center py-16">You must log in to access this page.</div>;
  return children;
};

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route path="/services" element={<OurServicesPage />} />
            <Route path="/interior-decor" element={<InteriorDecor />} />
            <Route path="/inquiry" element={<ProductInquiry />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/test-product" element={<ProductPage />} />
            <Route path="/newsletter" element={<NewsletterForm />} />

            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <ProductPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div className="text-center py-16">404 - Page Not Found</div>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
