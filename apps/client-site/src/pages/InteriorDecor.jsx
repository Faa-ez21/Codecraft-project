import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { ChevronDown } from 'lucide-react';
import Footer from '../components/footer';
import Header from "../components/header";
import Pinnacle from '../assets/Pinnacle.jpg';
import Calbank from '../assets/Calbank.jpg';
import ExpertOffice from '../assets/ExpertOffice.jpg';

const ServicesSection = () => {
  const projects = [
    {
      title: 'Pinnacle Office',
      img: Pinnacle,
      path: 'https://photos.app.goo.gl/DuRGyy2zFmyqiCch6'
    },
    {
      title: 'Calbank ',
      img: Calbank,
      path: 'https://photos.app.goo.gl/DmyHSgGh9hdYqbF39'
    },
    {
      title: 'Expert Office',
      img: ExpertOffice,
      path: 'https://photos.app.goo.gl/iqCriFyAFtvXFHTf8'
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      <section className="px-6 md:px-20 py-10 bg-[#FAFCF7] min-h-screen">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Interior Decoration and Office Design</h2>
        <p className="text-green-700 mb-6">Your trusted partner in creating inspiring workspaces.</p>

        

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Past Projects</h3>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
  {projects.map((project, index) => (
    <div
      key={index}
      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition duration-300 flex flex-col h-full"
    >
      <img src={project.img} alt={project.title} className="w-full object-cover h-64" />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <h4 className="text-lg font-medium text-gray-900 mb-4">{project.title}</h4>
        <div className="flex justify-center mt-auto">
          {project.path ? (
            <a
              href={project.path}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition"
            >
              View Details
            </a>
          ) : (
            <span className="text-sm text-gray-500">Details unavailable</span>
          )}
        </div>
      </div>
    </div>
  ))}
</div>


        <div className="flex flex-col items-start gap-4">
            <Link to="/inquiry">
              <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
                Inquire About Our Services
              </button>
            </Link>
          </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServicesSection;
