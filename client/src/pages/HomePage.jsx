import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Mic,
  Volume2,
  Sparkles,
  Camera,
  Truck,
  Recycle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Globe,
  Flame,
} from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import VoiceInput from '../components/VoiceInput';
import TextToSpeech from '../components/TextToSpeech';
import DisposalInstructionCard from '../components/DisposalInstructionCard';

const HomePage = () => {
  const navigate = useNavigate();
  const { speak, setIsAssistantOpen } = useVoice();
  const [scrapRates, setScrapRates] = useState([]);
  const [spokenRates, setSpokenRates] = useState('');
  const [voiceQuery, setVoiceQuery] = useState('');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get('/api/dashboard/scrap-rates');
        if (res.data.success) {
          setScrapRates(res.data.data);
          setSpokenRates(res.data.spokenRates);
        }
      } catch (e) {
        console.warn('Could not fetch scrap rates:', e);
      }
    };
    fetchRates();
  }, []);

  const sampleDisposalGuides = [
    {
      title: 'Plastic Water & Beverage Bottles',
      category: 'Recyclable',
      instructions: 'Empty liquid residue, rinse cleanly, remove the cap and crush flat to optimize bin capacity.',
      preparation: 'Ensure no residual liquid remains. Caps can be recycled with hard plastics.',
      binColor: 'Blue (Dry Recyclables)',
      environmentalImpact: 'Recycling 1 ton of PET plastic saves 3.8 barrels of crude oil and stops microplastic leaching.',
    },
    {
      title: 'Cardboard Delivery Cartons',
      category: 'Paper',
      instructions: 'Flatten all boxes completely and store away from damp conditions or rainwater.',
      preparation: 'Peel off shipping tape labels and staples to prevent paper pulping contamination.',
      binColor: 'Blue (Dry Paper)',
      environmentalImpact: 'Saves 17 adult trees and 4,000 kWh of electric energy per ton recycled.',
    },
    {
      title: 'Old Smartphones & Dead Batteries',
      category: 'E-Waste',
      instructions: 'Never throw into household trash. Hand over to authorized E-waste Kabadiwalas.',
      preparation: 'Cover terminal battery points with electrical insulating tape to avoid sparks.',
      binColor: 'Red / Black (Hazardous E-Waste)',
      environmentalImpact: 'Recovers rare gold and copper while stopping cadmium soil water contamination.',
    },
    {
      title: 'Fruit Rinds & Vegetable Scraps',
      category: 'Organic',
      instructions: 'Deposit in municipal green organic bin or your household garden aerobic compost bin.',
      preparation: 'Remove plastic fruit price stickers and nylon grocery strings before composting.',
      binColor: 'Green (Wet Compost)',
      environmentalImpact: 'Prevents landfill methane greenhouse gas release and nourishes agricultural topsoil.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles size={16} className="text-emerald-400" />
              <span>Smart India Hackathon • Next-Gen Circular Economy</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              AI Waste Segregation &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                Doorstep Kabadiwala
              </span>{' '}
              Pickups
            </h1>

            <p className="text-base sm:text-xl text-gray-300 font-normal leading-relaxed">
              Snap a photo of your waste to instantly classify it with AI, listen to disposal instructions in your regional language, and schedule verified doorstep scrap pickups with fair market pricing.
            </p>

            {/* Quick Interactive Voice Search Trigger */}
            <div className="max-w-xl mx-auto pt-2">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-gray-900/90 border border-emerald-500/40 shadow-2xl flex items-center gap-2">
                <input
                  type="text"
                  placeholder='Try speaking: "Find plastic recycling centers"'
                  value={voiceQuery}
                  onChange={(e) => setVoiceQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-transparent text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none"
                />
                <VoiceInput
                  onTranscript={(text) => {
                    setVoiceQuery(text);
                    navigate(`/services?query=${encodeURIComponent(text)}`);
                  }}
                  size="md"
                  label="Speak"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (voiceQuery.trim()) {
                      navigate(`/services?query=${encodeURIComponent(voiceQuery.trim())}`);
                    } else {
                      setIsAssistantOpen(true);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/30 shrink-0"
                >
                  Search
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Mic size={13} className="text-emerald-400" /> Speech-to-Text
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Volume2 size={13} className="text-emerald-400" /> Text-to-Speech
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe size={13} className="text-emerald-400" /> EN • HI • BN • PA
                </span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/classify"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <Camera size={19} />
                <span>Classify Waste Now</span>
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/services"
                className="px-6 py-3.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 text-emerald-300 font-bold text-base border border-emerald-500/40 transition-all flex items-center gap-2"
              >
                <Truck size={19} />
                <span>Find Local Kabadiwala</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsAssistantOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-base border border-emerald-600/50 transition-all flex items-center gap-2"
              >
                <Mic size={19} className="text-emerald-400 animate-pulse" />
                <span>Ask Voice Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of WasteWise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white">How WasteWise Empowers You</h2>
          <p className="text-sm sm:text-base text-gray-400 mt-2">
            An intelligent circular waste assistant bringing AI computer vision, voice inclusivity, and neighborhood informal recyclers together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-gray-900/80 border border-emerald-500/30 hover:border-emerald-500/70 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/40">
                <Camera size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Image Classifier</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Snap any item to identify material composition, recyclability confidence, preparation instructions, and bin color code.
              </p>
            </div>
            <Link to="/classify" className="mt-4 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Try Classifier <ArrowRight size={13} />
            </Link>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-gray-900/80 border border-emerald-500/30 hover:border-emerald-500/70 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/40">
                <Truck size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Kabadiwala Connect</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Search verified scrap dealers and recycling plants with live buyback rates for paper, plastics, e-waste, and metals.
              </p>
            </div>
            <Link to="/services" className="mt-4 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Browse Centers <ArrowRight size={13} />
            </Link>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-gray-900/80 border border-emerald-500/30 hover:border-emerald-500/70 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/40">
                <Mic size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Voice Dictation (STT)</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Speak naturally to fill pickup forms, add spoken notes to classified items, and search recycling services hands-free.
              </p>
            </div>
            <Link to="/pickup" className="mt-4 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Voice Pickup <ArrowRight size={13} />
            </Link>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-gray-900/80 border border-emerald-500/30 hover:border-emerald-500/70 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/40">
                <Volume2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Text-to-Speech (TTS)</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Listen to complete classification breakdowns, disposal instructions, and dashboard stats in Hindi, English, Bengali, or Punjabi.
              </p>
            </div>
            <Link to="/dashboard" className="mt-4 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Read Dashboard <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Live Indian Scrap Market Rates (with 🔊 Read Rates) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gray-900/90 border border-emerald-500/30 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-emerald-400" size={22} />
                <h3 className="text-xl sm:text-2xl font-black text-white">Live Indian Scrap Buyback Rates</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Transparent benchmark rates updated daily across registered Kabadiwala partners.
              </p>
            </div>

            {/* Read Scrap Rates aloud */}
            {spokenRates && (
              <TextToSpeech text={spokenRates} label="Read Scrap Rates" size="md" />
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {scrapRates.map((item) => (
              <div
                key={item.material}
                className="p-3.5 rounded-xl bg-gray-950/70 border border-gray-800 hover:border-emerald-500/40 transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  {item.category}
                </span>
                <div className="text-sm font-semibold text-gray-200 truncate" title={item.material}>
                  {item.material}
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-xl font-black text-white">₹{item.rate}</span>
                  <span className="text-xs text-gray-400">/{item.unit.replace('₹/', '')}</span>
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 font-medium">{item.trend}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 gap-3">
            <span>Rates verified under Fair Trade Circularity standards. Actual rates may vary by quantity.</span>
            <Link to="/pickup" className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Book Pickup at these rates <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Disposal Instructions Showcase with 🔊 Listen buttons (Requirement #47) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Proper Disposal Guidelines</h2>
            <p className="text-sm text-gray-400 mt-1">
              Click the <Volume2 size={15} className="inline text-emerald-400" /> <b>Listen</b> button on any card to hear step-by-step preparation and bin segregation instructions.
            </p>
          </div>
          <Link
            to="/classify"
            className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Check your item with AI <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleDisposalGuides.map((guide) => (
            <DisposalInstructionCard
              key={guide.title}
              title={guide.title}
              category={guide.category}
              instructions={guide.instructions}
              preparation={guide.preparation}
              binColor={guide.binColor}
              environmentalImpact={guide.environmentalImpact}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
