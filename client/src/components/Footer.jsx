import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Mic, Volume2, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';
import TextToSpeech from './TextToSpeech';

const Footer = () => {
  const footerSpeech =
    'WasteWise is an AI-powered waste management, classification, and Kabadiwala pickup platform built for Smart India Hackathon. It provides full speech-to-text and text-to-speech accessibility in four languages.';

  return (
    <footer className="w-full bg-gray-950 border-t border-emerald-500/20 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
              <Recycle size={22} />
            </div>
            <span className="text-xl font-black text-white">
              Waste<span className="text-emerald-400">Wise</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            AI-driven waste sorting, doorstep Kabadiwala pickups, and native voice accessibility for sustainable Indian cities.
          </p>
          <div className="pt-1">
            <TextToSpeech text={footerSpeech} label="Listen to About WasteWise" size="sm" />
          </div>
        </div>

        {/* Quick Features */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Core Features</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/classify" className="hover:text-emerald-300 transition-colors flex items-center gap-1">
                AI Waste Classifier <ArrowUpRight size={13} className="text-gray-500" />
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-emerald-300 transition-colors flex items-center gap-1">
                Kabadiwala Directory <ArrowUpRight size={13} className="text-gray-500" />
              </Link>
            </li>
            <li>
              <Link to="/pickup" className="hover:text-emerald-300 transition-colors flex items-center gap-1">
                Schedule Scrap Pickup <ArrowUpRight size={13} className="text-gray-500" />
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-emerald-300 transition-colors flex items-center gap-1">
                Eco Impact Dashboard <ArrowUpRight size={13} className="text-gray-500" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Voice & Accessibility */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Accessibility & Voice</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-gray-300">
              <Mic size={15} className="text-emerald-400" />
              <span>Speech-to-Text (STT)</span>
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <Volume2 size={15} className="text-emerald-400" />
              <span>Text-to-Speech (TTS)</span>
            </li>
            <li>
              <Link to="/settings" className="hover:text-emerald-300 transition-colors">
                Configure Voice & Rates
              </Link>
            </li>
            <li className="text-xs text-emerald-400/90 font-medium">
              English • हिन्दी • বাংলা • ਪੰਜਾਬੀ
            </li>
          </ul>
        </div>

        {/* Compliance / Team */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">SIH 2026 Initiative</h4>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            Kabadiwala Connect & Swachh Bharat Mission AI Integration. Designed with high-contrast screen reader compliance and zero-cost native Web Speech APIs.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 font-semibold">
            <ShieldCheck size={14} />
            <span>Zero-Cost Web Speech API Native</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <div>© 2026 WasteWise Technologies. Smart Circular Waste Management.</div>
        <div className="flex items-center gap-1 text-gray-400">
          <span>Crafted with</span>
          <Heart size={13} className="text-rose-500 fill-rose-500" />
          <span>for a cleaner, greener India.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
