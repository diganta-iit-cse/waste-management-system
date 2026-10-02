import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useVoice, SUPPORTED_LANGUAGES } from '../context/VoiceContext';

const LanguageSelector = ({ className = '', showLabel = true }) => {
  const { language, setLanguage } = useVoice();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select voice and recognition language"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-emerald-500/30 text-emerald-300 hover:text-emerald-100 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <Globe size={16} className="text-emerald-400" />
        {showLabel && (
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-200">{currentLang.native}</span>
            <span className="text-xs text-gray-400 hidden sm:inline">({currentLang.name})</span>
          </span>
        )}
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-52 rounded-xl bg-gray-900 border border-emerald-500/40 shadow-2xl py-1 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1.5 border-b border-gray-800 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Voice & Speech Language
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-sm transition-colors ${
                  isSelected
                    ? 'bg-emerald-950/80 text-emerald-300 font-semibold border-l-2 border-emerald-400'
                    : 'text-gray-200 hover:bg-gray-800/80 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-medium">{lang.native}</div>
                  <div className="text-xs text-gray-400">{lang.name}</div>
                </div>
                {isSelected && <Check size={16} className="text-emerald-400 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
