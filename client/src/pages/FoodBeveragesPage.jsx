import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addFoodItem, removeFoodItem, clearFood } from '../features/booking/bookingSlice';
import FoodCard from '../components/booking/FoodCard';
import PriceSummary from '../components/booking/PriceSummary';
import api from '../api/axiosInstance';
import { UtensilsCrossed, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';

const CATEGORIES = ['All', 'Combos', 'Popcorn', 'Snacks', 'Beverages'];

const FoodBeveragesPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { foodCart, selectedSeats } = useSelector((state) => state.booking);
  const [foodItems, setFoodItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // If user accesses this page without seats selected, redirect back to seat selection
  useEffect(() => {
    if (!selectedSeats || selectedSeats.length === 0) {
      navigate(`/booking/${showId}`);
    }
  }, [selectedSeats, showId, navigate]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const res = await api.get('/food');
        setFoodItems(res.data.data || []);
      } catch (err) {
        console.error('Failed to load food:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? foodItems
      : foodItems.filter((item) => item.category === activeCategory);

  const getItemQuantity = (id) => {
    const cartItem = foodCart.find((f) => f._id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleContinue = () => {
    navigate(`/booking/${showId}/checkout`);
  };

  const handleSkip = () => {
    dispatch(clearFood());
    navigate(`/booking/${showId}/checkout`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/booking/${showId}`)}
            className="p-2 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-gray-300 hover:text-white border border-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-brand" />
              <span>Grab a Bite & Beverage</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Pre-order gourmet snacks and get them served directly to your seats
            </p>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cinema-850 hover:bg-cinema-800 text-gray-300 hover:text-white text-xs font-bold border border-white/10 transition-colors self-start sm:self-auto"
        >
          <span>Skip Snacks</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Concessions & Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Concession Items Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'bg-cinema-850 text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Cards List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-cinema-900 rounded-2xl h-32 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <FoodCard
                  key={item._id}
                  item={item}
                  quantity={getItemQuantity(item._id)}
                  onAdd={() => dispatch(addFoodItem(item))}
                  onRemove={() => dispatch(removeFoodItem(item._id))}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sticky Price Summary */}
        <div className="lg:col-span-1">
          <PriceSummary
            onProceed={handleContinue}
            proceedLabel="Proceed to Checkout →"
          />
        </div>
      </div>
    </div>
  );
};

export default FoodBeveragesPage;
