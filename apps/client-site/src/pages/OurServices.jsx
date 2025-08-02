import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { ChevronDown } from 'lucide-react';
import Footer from '../components/footer';
import Header from "../components/header";

const services = [
  {
    title: "Furniture Providers",
    description: "High-quality furniture for any office size.",
    image: "furniture.jpg",
  },
  {
    title: "Office Design",
    description: "Aid in furniture selection, Layouts in 2D/3D.",
    image: "design.jpg",
  },
  {
    title: "Office Fitouts",
    description: "Complete fitout solutions for your office.",
    image: "fitouts.jpg",
  },
  {
    title: "Consultancy",
    description: "Expert advice on projects, fitouts, and training.",
    image: "consultancy.jpg",
  },
  {
    title: "Office Refurbishment",
    description:
      "We design and refurbish existing offices to give it a modern outlook bearing in mind your comfort, style and budget.",
    image: "refurbishment.jpg",
  },
  {
    title: "Interior Decoration",
    description:
      "We work with your corporate colours, number of occupants etc., to provide suitable furniture to increase productivity and comfort in a working environment.",
    image: "interior.jpg",
  },
];

export default function OurServicesPage() {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Header />

      <main id="services" className="py-12 px-6 text-center">
        <h2 className="text-3xl font-bold">Our Services</h2>
        <p className="mt-2 text-gray-600">Enhance your workspace with our comprehensive services.</p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-left">
                <h4 className="text-lg font-semibold mb-1">{service.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <button className="bg-green-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-800 transition">
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <section id="about" className="py-12 px-6 bg-gray-100 text-center">
        <h3 className="text-2xl font-bold mb-4">Our Story</h3>
        <p className="max-w-3xl mx-auto text-gray-700">
          At Office Solutions, our mission is to create ergonomic, comfortable, and functional office spaces that enhance productivity and well-being. With years of experience, we are committed to delivering exceptional service and quality products to meet your unique needs.
        </p>
      </section>

      <Footer />
    </div>
  );
} 
