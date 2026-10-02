import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CategoryNav from '../components/layout/CategoryNav';
import Footer from '../components/layout/Footer';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import ToastContainer from '../components/common/ToastContainer';
import { categoryAPI } from '../services/api';

const MainLayout = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (res.data.success && res.data.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories in MainLayout:', err);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F3F6]">
      <ToastContainer />
      <Navbar />
      <CategoryNav categories={categories} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;
