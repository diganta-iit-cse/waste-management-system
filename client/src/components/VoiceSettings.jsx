import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  VolumeX,
  Gauge,
  Sliders,
  Sparkles,
  Eye,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useVoice, SUPPORTED_LANGUAGES } from '../context/VoiceContext';
import { useAuth } from '../context/AuthContext';

const VoiceSettings = ({ className = '' }) => {
  const {
    language,
    setLanguage,
    speechToTextEnabled,
    setSpeechToTextEnabled,
    textToSpeechEnabled,
    setTextToSpeechEnabled,
    autoVoiceFeedback,
    setAutoVoiceFeedback,
    speechRate,
    setSpeechRate,
    volume,
    setVolume,
    accessibilityMode,
    toggleAccessibilityMode,
    speak,
  } = useVoice();

  const { user, updatePreferences } = useAuth();
  const [testNotification, setTestNotification] = useState('');

  const handleTestSpeech = () => {
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);
    let sample = `Hello! This is WasteWise intelligent voice assistant speaking in ${langObj?.name || 'English'}. All voice systems are fully operational.`;

    if (language === 'hi-IN') {
      sample = 'नमस्ते! यह वेस्टवाइज़ वॉयस असिस्टेंट है। कचरा प्रबंधन प्रणाली में आपका स्वागत है।';
    } else if (language === 'bn-IN') {
      sample = 'নমস্কার! এটি ওয়েস্টওয়াইজ ভয়েস অ্যাসিস্ট্যান্ট। বর্জ্য ব্যবস্থাপনায় আপনাকে স্বাগতম।';
    } else if (language === 'pa-IN') {
      sample = 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਇਹ ਵੇਸਟਵਾਈਜ਼ ਵਾਇਸ ਅਸਿਸਟੈਂਟ ਹੈ। ਕੂੜਾ ਪ੍ਰਬੰਧਨ ਪ੍ਰਣਾਲੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ।';
    }

    setTestNotification('Playing audio test sample...');
    speak(sample);
    setTimeout(() => setTestNotification(''), 4000);
  };

  const handleSyncToProfile = async () => {
    if (user) {
      await updatePreferences({
        accessibilityMode,
        voiceSettings: {
          language,
          speechToTextEnabled,
          textToSpeechEnabled,
          autoVoiceFeedback,
          speechRate,
          volume,
        },
      });
      setTestNotification('Settings saved to your cloud profile!');
      setTimeout(() => setTestNotification(''), 3000);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Voice Core Toggles */}
      <div className="bg-gray-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Sliders className="text-emerald-400" size={20} />
          Speech & Audio Controls
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* STT Toggle */}
          <div className="p-4 rounded-xl bg-gray-950/70 border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  speechToTextEnabled ? 'bg-emerald-950 text-emerald-400' : 'bg-gray-800 text-gray-500'
                }`}
              >
                <Mic size={20} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-200">Speech-to-Text</div>
                <div className="text-xs text-gray-400">Microphone voice dictation</div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={speechToTextEnabled}
              onClick={() => {
                setSpeechToTextEnabled(!speechToTextEnabled);
                handleSyncToProfile();
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                speechToTextEnabled ? 'bg-emerald-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  speechToTextEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* TTS Toggle */}
          <div className="p-4 rounded-xl bg-gray-950/70 border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  textToSpeechEnabled ? 'bg-emerald-950 text-emerald-400' : 'bg-gray-800 text-gray-500'
                }`}
              >
                <Volume2 size={20} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-200">Text-to-Speech</div>
                <div className="text-xs text-gray-400">Screen & card reading aloud</div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={textToSpeechEnabled}
              onClick={() => {
                setTextToSpeechEnabled(!textToSpeechEnabled);
                handleSyncToProfile();
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                textToSpeechEnabled ? 'bg-emerald-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  textToSpeechEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Auto Voice Feedback Toggle */}
          <div className="p-4 rounded-xl bg-gray-950/70 border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  autoVoiceFeedback ? 'bg-emerald-950 text-emerald-400' : 'bg-gray-800 text-gray-500'
                }`}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-200">Auto Voice Feedback</div>
                <div className="text-xs text-gray-400">Audio spoken action alerts</div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={autoVoiceFeedback}
              onClick={() => {
                setAutoVoiceFeedback(!autoVoiceFeedback);
                handleSyncToProfile();
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                autoVoiceFeedback ? 'bg-emerald-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoVoiceFeedback ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Language & Voice Tuning */}
      <div className="bg-gray-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Gauge className="text-emerald-400" size={20} />
          Voice Language & Tuning
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Language Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Voice Language</label>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    handleSyncToProfile();
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    language === lang.code
                      ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md'
                      : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
                  }`}
                >
                  <div className="font-bold text-sm text-emerald-300">{lang.native}</div>
                  <div className="text-xs">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Speech Rate: Slow, Normal, Fast */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Speech Rate: <span className="text-emerald-400">{speechRate}x</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Slow', val: 0.8 },
                { label: 'Normal', val: 1.0 },
                { label: 'Fast', val: 1.25 },
              ].map((rate) => (
                <button
                  key={rate.label}
                  type="button"
                  onClick={() => {
                    setSpeechRate(rate.val);
                    handleSyncToProfile();
                  }}
                  className={`py-3 px-2 rounded-xl font-semibold text-sm border transition-all text-center ${
                    speechRate === rate.val
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-500/30'
                      : 'bg-gray-950/60 border-gray-800 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {rate.label}
                  <div className="text-xs font-normal text-emerald-200">{rate.val}x</div>
                </button>
              ))}
            </div>
          </div>

          {/* Volume: 0–100% */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center justify-between">
              <span>Voice Volume</span>
              <span className="text-emerald-400 font-bold">{Math.round(volume * 100)}%</span>
            </label>
            <div className="p-3 bg-gray-950/70 border border-gray-800 rounded-xl space-y-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  setVolume(e.target.value);
                  handleSyncToProfile();
                }}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0% (Mute)</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Test & Profile Save Notification */}
        <div className="mt-6 pt-5 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-400">
            {testNotification ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5 animate-pulse">
                <CheckCircle size={14} />
                {testNotification}
              </span>
            ) : (
              'Test speech output to verify your speakers and synthesized voice settings.'
            )}
          </div>
          <button
            type="button"
            onClick={handleTestSpeech}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Volume2 size={16} />
            <span>Test Voice Output</span>
          </button>
        </div>
      </div>

      {/* Accessibility Mode Toggle Section (Requirement #51) */}
      <div className="bg-gray-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl ${
                accessibilityMode
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              <Eye size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Accessibility Mode
                {accessibilityMode && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                    ACTIVE
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                Increases font sizes, expands button touch targets, elevates high-contrast borders, and highlights voice controls.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              toggleAccessibilityMode();
              handleSyncToProfile();
            }}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-4 ${
              accessibilityMode
                ? 'bg-amber-500 hover:bg-amber-400 text-gray-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
                : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50'
            }`}
          >
            {accessibilityMode ? 'Disable Accessibility Mode' : 'Enable Accessibility Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettings;
