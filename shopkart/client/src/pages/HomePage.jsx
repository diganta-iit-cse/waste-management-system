import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  Award,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const heroBanners = [
  {
    id: 1,
    title: 'Grand Festive Mega Sale',
    subtitle: 'Up to 50% OFF on Top Smartphones & Laptops',
    cta: 'Explore Mobiles',
    link: '/products?category=mobiles',
    bg: 'from-blue-700 via-indigo-800 to-slate-900',
    tag: 'LIMITED TIME OFFER',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Autumn Fashion Carnival',
    subtitle: 'Premium Denims, Sneakers & Designer Wear',
    cta: 'Shop Fashion',
    link: '/products?category=fashion',
    bg: 'from-rose-700 via-purple-800 to-slate-900',
    tag: 'MIN. 40% OFF',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Smart Home & Kitchen Makeover',
    subtitle: 'Modern Cookware, Air Fryers & Smart LED Lighting',
    cta: 'Upgrade Home',
    link: '/products?category=kitchen',
    bg: 'from-emerald-700 via-teal-800 to-slate-900',
    tag: 'BEST PRICES GUARANTEED',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
  }
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [featuredData, setFeaturedData] = useState({
    dealsOfTheDay: [],
    bestSellers: [],
    trending: [],
    recommended: []
  });
  const [loading, setLoading] = useState(true);

  // Countdown timer for deals of the day (e.g. resets every 24h)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance hero carousel
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5500);
    return () => clearInterval(slideTimer);
  }, []);

  // Fetch categories and featured products from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, featuredRes] = await Promise.all([
          categoryAPI.getCategories(),
          productAPI.getFeatured()
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.categories || []);
        }

        if (featuredRes.data.success) {
          setFeaturedData({
            dealsOfTheDay: featuredRes.data.dealsOfTheDay || [],
            bestSellers: featuredRes.data.bestSellers || [],
            trending: featuredRes.data.trending || [],
            recommended: featuredRes.data.recommended || []
          });
        }
      } catch (err) {
        console.error('Failed to fetch homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading marketplace deals..." size="lg" />;
  }

  return (
    <div className="space-y-10">
      {/* Hero Banner Carousel */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-900 text-white min-h-[320px] sm:min-h-[380px] flex items-center">
        {heroBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 bg-gradient-to-r ${banner.bg} p-6 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="max-w-xl space-y-3 sm:space-y-4 text-center md:text-left">
              <span className="inline-block bg-amber-400 text-gray-950 font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {banner.tag}
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {banner.title}
              </h1>
              <p className="text-gray-200 text-sm sm:text-base font-normal">
                {banner.subtitle}
              </p>
              <div className="pt-2">
                <Link
                  to={banner.link}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-950 hover:bg-amber-400 font-bold rounded-xl text-sm transition-all shadow-md active:scale-95"
                >
                  <span>{banner.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="hidden md:block relative w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-300"
              />
            </div>
          </div>
        ))}

        {/* Carousel controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroBanners.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Category Circles Quick Bar */}
      <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Featured Categories</h2>
          <Link to="/products" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center p-3 rounded-xl hover:bg-blue-50/60 transition text-center"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden mb-2 bg-gray-100 border border-gray-200 group-hover:border-blue-500 group-hover:scale-105 transition-all p-1">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-blue-600 transition truncate w-full">
                {cat.name}
              </span>
              <span className="text-[10px] text-gray-400">
                {cat.productCount ? `${cat.productCount} items` : 'Explore'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals of the Day (with Countdown Timer) */}
      {featuredData.dealsOfTheDay.length > 0 && (
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Zap className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Deals of the Day</h2>
                <p className="text-xs text-gray-500">Unbeatable discounts on popular picks</p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2 bg-rose-50/70 border border-rose-100 px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-gray-700">Ends in:</span>
              <div className="flex items-center gap-1 font-mono text-xs font-black text-rose-600">
                <span className="bg-white px-1.5 py-0.5 rounded shadow-2xs">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                :
                <span className="bg-white px-1.5 py-0.5 rounded shadow-2xs">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                :
                <span className="bg-white px-1.5 py-0.5 rounded shadow-2xs">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredData.dealsOfTheDay.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {featuredData.bestSellers.length > 0 && (
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Award className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Best Sellers</h2>
                <p className="text-xs text-gray-500">Most purchased items this week</p>
              </div>
            </div>
            <Link
              to="/products?sort=popular"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredData.bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Products */}
      {featuredData.trending.length > 0 && (
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Trending Now</h2>
                <p className="text-xs text-gray-500">Trending picks loved by thousands</p>
              </div>
            </div>
            <Link
              to="/products?sort=newest"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredData.trending.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended Products */}
      {featuredData.recommended.length > 0 && (
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recommended For You</h2>
                <p className="text-xs text-gray-500">Top customer-rated picks</p>
              </div>
            </div>
            <Link
              to="/products?rating=4"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredData.recommended.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Trust & Guarantee Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Shop with Confidence</h3>
              <p className="text-xs text-gray-300">All products are verified authentic and 100% genuine.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Truck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Lightning Express Delivery</h3>
              <p className="text-xs text-gray-300">Fast doorstep dispatch with real-time tracking.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <RotateCcw className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">7-Day Easy Returns</h3>
              <p className="text-xs text-gray-300">Instant replacements or refunds with no hassle.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
