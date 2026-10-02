import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCity, closeLocationModal } from '../../features/city/citySlice';
import { addToast } from '../../features/ui/uiSlice';
import { MapPin, Search, Navigation, X, Check } from 'lucide-react';

const LocationModal = () => {
  const dispatch = useDispatch();
  const { isLocationModalOpen, selectedCity, popularCities } = useSelector((state) => state.city);
  const [searchTerm, setSearchTerm] = useState('');
  const [detecting, setDetecting] = useState(false);

  if (!isLocationModalOpen) return null;

  const filteredCities = popularCities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (city) => {
    dispatch(setCity(city));
    dispatch(addToast({ type: 'success', message: `Location set to ${city}` }));
  };

  const handleDetectLocation = () => {
    setDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setDetecting(false);
          // Defaulting to Mumbai as prominent entertainment capital for demo GPS
          handleSelect('Mumbai');
        },
        () => {
          setDetecting(false);
          dispatch(addToast({ type: 'info', message: 'Location permission denied, selected Mumbai as default' }));
          handleSelect('Mumbai');
        },
        { timeout: 5000 }
      );
    } else {
      setDetecting(false);
      handleSelect('Mumbai');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-cinema-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-brand" />
            <h3 className="text-xl font-bold text-white">Select Your City</h3>
          </div>
          <button
            onClick={() => dispatch(closeLocationModal())}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for your city (e.g. Mumbai, Delhi, Bengaluru)..."
            className="w-full bg-cinema-800 text-white pl-11 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-brand text-sm"
          />
        </div>

        {/* Auto Detect Button */}
        <button
          onClick={handleDetectLocation}
          disabled={detecting}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-brand/30 bg-brand/10 hover:bg-brand/20 text-brand font-medium text-sm transition-all duration-200"
        >
          <Navigation className={`w-4 h-4 ${detecting ? 'animate-spin' : ''}`} />
          {detecting ? 'Detecting your coordinates...' : 'Auto Detect My Current Location'}
        </button>

        {/* Popular Cities Grid */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-3">
            Popular Indian Cities
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredCities.map((city) => {
              const isSelected = selectedCity.toLowerCase() === city.toLowerCase();
              return (
                <button
                  key={city}
                  onClick={() => handleSelect(city)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-brand/15 border-brand text-white shadow-md shadow-brand/10'
                      : 'bg-cinema-850/60 border-white/5 text-gray-300 hover:border-white/20 hover:text-white hover:bg-cinema-800'
                  }`}
                >
                  <span>{city}</span>
                  {isSelected && <Check className="w-4 h-4 text-brand" />}
                </button>
              );
            })}
          </div>
          {filteredCities.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">
              No cities found matching "{searchTerm}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
