import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import ShopPage from './pages/ShopPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ContactPage from './pages/ContactPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}






