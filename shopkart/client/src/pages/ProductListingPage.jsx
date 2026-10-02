import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Grid, SearchX } from 'lucide-react';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import ProductFilterSidebar from '../components/product/ProductFilterSidebar';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL parameters state
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const discount = searchParams.get('discount') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Component state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (res.data.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch products from backend whenever URL search params change
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        sort
      };

      if (search) params.search = search;
      if (category && category !== 'all') params.category = category;
      if (brand) params.brand = brand;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (rating) params.rating = rating;
      if (discount) params.discount = discount;

      const res = await productAPI.getProducts(params);
      if (res.data.success) {
        setProducts(res.data.products || []);
        setTotalPages(res.data.pages || 1);
        setTotalProducts(res.data.totalProducts || 0);
        if (res.data.availableBrands) {
          setAvailableBrands(res.data.availableBrands);
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, brand, minPrice, maxPrice, rating, discount, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Helper to update URL search parameters
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter changes unless changing page directly
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSelectCategory = (catSlug) => {
    updateParam('category', catSlug);
  };

  const handleToggleBrand = (brandName) => {
    const currentList = brand ? brand.split(',') : [];
    let updated;
    if (currentList.includes(brandName)) {
      updated = currentList.filter((b) => b !== brandName);
    } else {
      updated = [...currentList, brandName];
    }
    updateParam('brand', updated.join(','));
  };

  const handleApplyPrice = (min, max) => {
    const newParams = new URLSearchParams(searchParams);
    if (min) newParams.set('minPrice', min);
    else newParams.delete('minPrice');

    if (max) newParams.set('maxPrice', max);
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSelectRating = (rate) => {
    updateParam('rating', rate);
  };

  const handleSelectDiscount = (disc) => {
    updateParam('discount', disc);
  };

  const handleClearAll = () => {
    const newParams = new URLSearchParams();
    if (search) newParams.set('search', search);
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    updateParam('sort', e.target.value);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900 capitalize">
            {search
              ? `Results for "${search}"`
              : category && category !== 'all'
              ? `${category} Store`
              : 'All Products'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing {products.length > 0 ? (page - 1) * 12 + 1 : 0} -{' '}
            {Math.min(page * 12, totalProducts)} of {totalProducts} items
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-200 transition"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sort}
              onChange={handleSortChange}
              className="text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rated</option>
              <option value="popular">Popularity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Products Grid */}
      <div className="flex gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block sticky top-24">
          <ProductFilterSidebar
            categories={categories}
            availableBrands={availableBrands}
            selectedCategory={category}
            onSelectCategory={handleSelectCategory}
            selectedBrands={brand ? brand.split(',') : []}
            onToggleBrand={handleToggleBrand}
            priceRange={{ min: minPrice, max: maxPrice }}
            onApplyPrice={handleApplyPrice}
            selectedRating={rating}
            onSelectRating={handleSelectRating}
            selectedDiscount={discount}
            onSelectDiscount={handleSelectDiscount}
            onClearAll={handleClearAll}
          />
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <LoadingSpinner text="Finding products..." size="lg" />
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-2xs space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No matching products found</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try changing or clearing some filters to see more results.
              </p>
              <button
                onClick={handleClearAll}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-xl flex flex-col">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm">Filter Products</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <ProductFilterSidebar
                  categories={categories}
                  availableBrands={availableBrands}
                  selectedCategory={category}
                  onSelectCategory={(cat) => {
                    handleSelectCategory(cat);
                    setMobileFilterOpen(false);
                  }}
                  selectedBrands={brand ? brand.split(',') : []}
                  onToggleBrand={handleToggleBrand}
                  priceRange={{ min: minPrice, max: maxPrice }}
                  onApplyPrice={(min, max) => {
                    handleApplyPrice(min, max);
                    setMobileFilterOpen(false);
                  }}
                  selectedRating={rating}
                  onSelectRating={(r) => {
                    handleSelectRating(r);
                    setMobileFilterOpen(false);
                  }}
                  selectedDiscount={discount}
                  onSelectDiscount={(d) => {
                    handleSelectDiscount(d);
                    setMobileFilterOpen(false);
                  }}
                  onClearAll={() => {
                    handleClearAll();
                    setMobileFilterOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
