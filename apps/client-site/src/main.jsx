import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/home';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css'; // Import Tailwind CSS
import CartPage from './pages/CartPage'; // Import CartPage
import OurServicesPage from './pages/OurServices'; // Import OurServicesPage

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} /> {/* ✅ NEW ROUTE */}
        <Route path="/shop" element={<ShopPage />} /> {/* ✅ NEW ROUTE */}
        <Route path="/contact" element={<ContactPage />} /> {/* ✅ NEW ROUTE */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<CartPage />} /> {/* ✅ NEW ROUTE */}
        <Route path="/services" element={<OurServicesPage />} /> {/* ✅ NEW ROUTE */}
        {/* Add other routes as needed */}
        <Route path="*" element={<div className="text-center py-16">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  </StrictMode>
);