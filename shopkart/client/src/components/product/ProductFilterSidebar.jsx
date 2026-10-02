import React, { useState, useEffect } from 'react';
import { Star, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

const ProductFilterSidebar = ({
  categories = [],
  availableBrands = [],
  selectedCategory,
  onSelectCategory,
  selectedBrands = [],
  onToggleBrand,
  priceRange = { min: '', max: '' },
  onPriceChange,
  onApplyPrice,
  selectedRating,
  onSelectRating,
  selectedDiscount,
  onSelectDiscount,
  onClearAll
}) => {
  const [minInput, setMinInput] = useState(priceRange.min || '');
  const [maxInput, setMaxInput] = useState(priceRange.max || '');
  const [brandSearch, setBrandSearch] = useState('');

  // Collapsible section toggles
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    brand: true,
    rating: true,
    discount: true
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    setMinInput(priceRange.min || '');
    setMaxInput(priceRange.max || '');
  }, [priceRange]);

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    onApplyPrice(minInput, maxInput);
  };

  const filteredBrands = availableBrands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 divide-y divide-gray-100 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <h3 className="font-bold text-gray-900 text-base">Filters</h3>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
        >
          <span>Categories</span>
          {openSections.category ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {openSections.category && (
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => onSelectCategory('all')}
              className={`w-full text-left px-2 py-1 rounded text-xs transition ${
                !selectedCategory || selectedCategory === 'all'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => onSelectCategory(cat.slug || cat.name)}
                className={`w-full text-left px-2 py-1 rounded text-xs transition flex items-center justify-between ${
                  selectedCategory === cat.slug || selectedCategory === cat.name
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {cat.productCount !== undefined && (
                  <span className="text-[10px] text-gray-400">({cat.productCount})</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
        >
          <span>Price (₹)</span>
          {openSections.price ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {openSections.price && (
          <form onSubmit={handlePriceSubmit} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                min="0"
              />
              <span className="text-gray-400 text-xs">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                min="0"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded transition"
            >
              Apply Price
            </button>
          </form>
        )}
      </div>

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div className="py-3.5">
          <button
            onClick={() => toggleSection('brand')}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
          >
            <span>Brands</span>
            {openSections.brand ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.brand && (
            <div className="space-y-2">
              {availableBrands.length > 5 && (
                <input
                  type="text"
                  placeholder="Search brand..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-500 mb-1"
                />
              )}
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {filteredBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => onToggleBrand(brand)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="truncate">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customer Ratings */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
        >
          <span>Customer Ratings</span>
          {openSections.rating ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {openSections.rating && (
          <div className="space-y-1.5">
            {[4, 3, 2, 1].map((r) => (
              <label
                key={r}
                className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <input
                  type="radio"
                  name="ratingFilter"
                  checked={selectedRating === String(r)}
                  onChange={() => onSelectRating(selectedRating === String(r) ? '' : String(r))}
                  className="text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="flex items-center gap-1">
                  <span>{r}★ & above</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Discount Filter */}
      <div className="py-3.5">
        <button
          onClick={() => toggleSection('discount')}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
        >
          <span>Discount</span>
          {openSections.discount ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {openSections.discount && (
          <div className="space-y-1.5">
            {[50, 40, 30, 20, 10].map((d) => (
              <label
                key={d}
                className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <input
                  type="radio"
                  name="discountFilter"
                  checked={selectedDiscount === String(d)}
                  onChange={() => onSelectDiscount(selectedDiscount === String(d) ? '' : String(d))}
                  className="text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span>{d}% or more</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilterSidebar;
