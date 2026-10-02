import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
        <ShoppingBag className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-gray-900">404</h1>
      <h2 className="text-lg font-bold text-gray-700">Page Not Found</h2>
      <p className="text-xs text-gray-500 max-w-sm">
        The page you are trying to visit does not exist or has been moved to another location.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
