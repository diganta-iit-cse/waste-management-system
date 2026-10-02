import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Smartphone,
  Laptop,
  Shirt,
  Home as HomeIcon,
  Utensils,
  Sparkles,
  ShoppingBag,
  Dumbbell,
  BookOpen,
  Gamepad2,
  Grid
} from 'lucide-react';

const categoryIcons = {
  mobiles: Smartphone,
  electronics: Laptop,
  fashion: Shirt,
  home: HomeIcon,
  kitchen: Utensils,
  beauty: Sparkles,
  grocery: ShoppingBag,
  sports: Dumbbell,
  books: BookOpen,
  toys: Gamepad2
};

const defaultCategories = [
  { name: 'Mobiles', slug: 'mobiles' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Home', slug: 'home' },
  { name: 'Kitchen', slug: 'kitchen' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Grocery', slug: 'grocery' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Books', slug: 'books' },
  { name: 'Toys', slug: 'toys' }
];

const CategoryNav = ({ categories = [] }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="bg-white border-b border-gray-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto py-2.5 scrollbar-none gap-2 sm:gap-6">
          <Link
            to="/products"
            className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              location.pathname === '/products' && !currentCategory
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <Grid className="w-4 h-4 text-blue-500" />
            <span>All Stores</span>
          </Link>

          {displayCategories.map((cat) => {
            const IconComponent = categoryIcons[cat.slug] || ShoppingBag;
            const isActive = currentCategory === cat.slug;

            return (
              <Link
                key={cat.slug || cat._id}
                to={`/products?category=${cat.slug}`}
                className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-bold'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
