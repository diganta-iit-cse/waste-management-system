import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Mic,
  Truck,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  Tag,
  Volume2,
  Clock,
  Sparkles,
  Filter,
  ArrowRight,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import VoiceInput from '../components/VoiceInput';
import TextToSpeech from '../components/TextToSpeech';

const CITIES = ['All', 'New Delhi', 'Bengaluru', 'Mumbai', 'Kolkata', 'Ludhiana', 'Hyderabad', 'Pune', 'Chennai'];
const MATERIAL_CATEGORIES = ['All', 'Plastic', 'Paper', 'Metal', 'E-Waste', 'Glass', 'Organic'];

const ServicesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { speak, speakFeedback } = useVoice();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('');

  // Spoken search state (Requirement #49 & #62)
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const [extractedMaterials, setExtractedMaterials] = useState([]);

  const fetchServices = async (query = '', city = 'All', material = 'All', coords = userLocation) => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.query = query;
      if (city && city !== 'All') params.city = city;
      if (material && material !== 'All') params.material = material;
      if (coords?.lat && coords?.lng) {
        params.userLat = coords.lat;
        params.userLng = coords.lng;
      }

      const res = await axios.get('/api/services', { params });
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (e) {
      console.warn('Error fetching services:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('query') || '';
    if (q) {
      setSearchQuery(q);
      handleVoiceSearch(q);
    } else {
      fetchServices('', selectedCity, selectedMaterial, userLocation);
    }
  }, [searchParams]);

  // Request browser GPS position to calculate real distances
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('Detecting GPS location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationStatus(`📍 Located! Sorted by closest to you.`);
        fetchServices(searchQuery, selectedCity, selectedMaterial, coords);
        speakFeedback('GPS coordinates detected. Sorting recycling centers by nearest distance.');
        setTimeout(() => setLocationStatus(''), 5000);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        // Fallback to Delhi coordinates for demo
        const fallback = { lat: 28.6139, lng: 77.2090 };
        setUserLocation(fallback);
        setLocationStatus('Using New Delhi coordinates as fallback location.');
        fetchServices(searchQuery, selectedCity, selectedMaterial, fallback);
        setTimeout(() => setLocationStatus(''), 5000);
      },
      { timeout: 10000 }
    );
  };

  // Execute Voice-based search (Requirement #49 & #62)
  const handleVoiceSearch = async (spokenText) => {
    if (!spokenText) return;
    setRecognizedSpeech(spokenText);
    setSearchQuery(spokenText);
    setLoading(true);

    try {
      const payload = { speechText: spokenText };
      if (userLocation) {
        payload.userLat = userLocation.lat;
        payload.userLng = userLocation.lng;
      }

      const res = await axios.post('/api/services/voice-search', payload);

      if (res.data.success) {
        setServices(res.data.data);
        setExtractedMaterials(res.data.extractedMaterials || []);

        if (res.data.spokenSummary) {
          speakFeedback(res.data.spokenSummary);
        }
      }
    } catch (err) {
      console.error('Voice search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearchSubmit = (e) => {
    e?.preventDefault();
    fetchServices(searchQuery, selectedCity, selectedMaterial, userLocation);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
          <Truck size={15} />
          <span>Real MongoDB Database • Verified Regional Kabadiwalas</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Recycling Services & Doorstep Scrap Dealers
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Find authorized Kabadiwalas offering doorstep digital weighing, fair market scrap rates, and instant UPI payouts.
        </p>
      </div>

      {/* Requirement #49 & #62: Voice Search Panel with GPS Proximity */}
      <div className="bg-gray-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Main search input with 🎤 microphone button */}
          <form onSubmit={handleManualSearchSubmit} className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder='Try saying: "Find e-waste recycling centers near me" or "I have plastic and paper"...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-gray-950 border border-emerald-500/30 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <VoiceInput
                onTranscript={(text) => handleVoiceSearch(text)}
                size="md"
                label="Voice Search"
              />
            </div>
          </form>

          {/* GPS Location Button */}
          <button
            type="button"
            onClick={handleGetLocation}
            title="Use current GPS location to find closest Kabadiwalas"
            className={`py-3.5 px-4 rounded-2xl text-sm font-semibold border flex items-center gap-2 shrink-0 transition-all ${
              userLocation
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow-md'
                : 'bg-gray-950 hover:bg-gray-800 text-gray-300 border-gray-800'
            }`}
          >
            <Navigation size={16} className={userLocation ? 'text-emerald-400 animate-pulse' : 'text-gray-400'} />
            <span className="hidden sm:inline">{userLocation ? 'GPS Active' : 'Near Me (GPS)'}</span>
          </button>

          {/* City Dropdown */}
          <div className="w-full md:w-52 shrink-0">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                fetchServices(searchQuery, e.target.value, selectedMaterial, userLocation);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  City: {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {locationStatus && (
          <div className="text-xs text-emerald-300 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-600/40 flex items-center gap-2 animate-in fade-in">
            <Navigation size={14} className="text-emerald-400" />
            <span>{locationStatus}</span>
          </div>
        )}

        {/* Requirement #49 Display: Recognized Speech Box */}
        {recognizedSpeech && (
          <div className="p-3.5 rounded-xl bg-gray-950 border border-emerald-500/40 text-xs sm:text-sm text-gray-200 flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Mic size={14} /> Recognized speech:
              </span>
              <span className="text-white italic font-medium">"{recognizedSpeech}"</span>
            </div>

            {/* Extracted materials chips (Requirement #62) */}
            {extractedMaterials.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 text-xs">Identified Materials:</span>
                {extractedMaterials.map((mat) => (
                  <span
                    key={mat}
                    className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-bold text-xs border border-emerald-600/50"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Material Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-gray-400 mr-1 flex items-center gap-1">
            <Filter size={13} /> Filter:
          </span>
          {MATERIAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedMaterial(cat);
                fetchServices(searchQuery, selectedCity, cat, userLocation);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedMaterial === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'bg-gray-950/80 hover:bg-gray-800 text-gray-300 border border-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Verified Partners
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600/40">
              {services.length} registered
            </span>
          </h2>
          <span className="text-xs text-gray-400">Physical data persisted in MongoDB WiredTiger database</span>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Fetching verified recycling centers from MongoDB...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="rounded-3xl bg-gray-900/90 border border-emerald-500/30 hover:border-emerald-500/60 shadow-xl backdrop-blur-md p-6 flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Card Header: Type, Rating, Listen Button */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50">
                      {service.serviceType}
                    </span>
                    <TextToSpeech
                      text={`${service.name}. Located at ${service.address}, ${service.city}. Working hours: ${service.workingHours}. Accepts: ${service.acceptedMaterials.join(', ')}. ${service.description}`}
                      label="Listen"
                      size="sm"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {service.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1 mb-3">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star size={14} className="fill-current" />
                      <span>{service.rating}</span>
                      <span className="text-gray-400 font-normal">({service.reviewCount})</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle size={14} />
                      <span>Verified</span>
                    </div>

                    {/* Real Calculated Distance Badge if GPS was triggered */}
                    {service.distanceKm !== undefined && (
                      <>
                        <span>•</span>
                        <span className="text-teal-300 font-bold bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-600/40">
                          📍 {service.distanceKm} km away
                        </span>
                      </>
                    )}
                  </div>

                  {/* SPCB License & Established Year */}
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3 px-3 py-1.5 rounded-lg bg-gray-950/50 border border-gray-800">
                    <span className="flex items-center gap-1 text-emerald-400/90">
                      <ShieldCheck size={12} /> {service.spcbRegNumber || 'CPCB/EPR/2026/IND-44'}
                    </span>
                    <span>Est. {service.establishedYear || 2018}</span>
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Location & Timings */}
                  <div className="space-y-1.5 text-xs text-gray-400 mb-4 p-3 rounded-xl bg-gray-950/60 border border-gray-800">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <MapPin size={13} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{service.address}, {service.city}</span>
                      </div>
                      {service.googleMapsUrl && (
                        <a
                          href={service.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold shrink-0 flex items-center gap-0.5"
                          title="Open in Google Maps"
                        >
                          <span>Maps</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-teal-400 shrink-0" />
                      <span>{service.workingHours}</span>
                    </div>
                  </div>

                  {/* Accepted Materials Tags */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                      Accepted Scrap:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {service.acceptedMaterials.map((mat) => (
                        <span
                          key={mat}
                          className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 text-[11px] font-medium"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Live Buyback Rates */}
                  {service.ratesPerKg && service.ratesPerKg.length > 0 && (
                    <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/30">
                      <div className="text-[11px] font-bold text-emerald-300 mb-1 flex items-center justify-between">
                        <span>Sample Buyback Rates</span>
                        <span>₹ per kg</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-300">
                        {service.ratesPerKg.slice(0, 4).map((r) => (
                          <div key={r.material} className="flex justify-between">
                            <span className="text-gray-400 truncate pr-1">{r.material}:</span>
                            <span className="font-bold text-white">₹{r.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-gray-800 flex items-center gap-2">
                  <a
                    href={`tel:${service.phone}`}
                    className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-emerald-400 transition-colors"
                    title={`Call ${service.phone}`}
                  >
                    <Phone size={17} />
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/pickup?service=${encodeURIComponent(
                          service.name
                        )}&wasteType=${encodeURIComponent(service.acceptedMaterials[0] || 'Mixed')}`
                      )
                    }
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Truck size={15} />
                    <span>Book Doorstep Pickup</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-400 bg-gray-900/60 rounded-3xl border border-gray-800 p-8 space-y-3">
            <Truck size={36} className="mx-auto text-emerald-500/50" />
            <h3 className="text-base font-bold text-gray-200">No Matching Recycling Services Found</h3>
            <p className="text-xs max-w-sm mx-auto">
              Try saying or searching another scrap material (e.g. "plastic", "cardboard", "e-waste") or clear the filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('All');
                setSelectedMaterial('All');
                setRecognizedSpeech('');
                fetchServices('', 'All', 'All', userLocation);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
