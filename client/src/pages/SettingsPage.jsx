import React from 'react';
import { Sliders, Mic, Volume2, ShieldCheck, HelpCircle } from 'lucide-react';
import VoiceSettings from '../components/VoiceSettings';
import TextToSpeech from '../components/TextToSpeech';

const SettingsPage = () => {
  const introSpeech =
    'This is the WasteWise voice and accessibility control center. You can toggle Speech-to-Text, configure Text-to-Speech playback, adjust speech speed, choose from four Indian languages, or enable high-contrast accessibility mode.';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gray-900/90 border border-emerald-500/30 shadow-2xl backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/40">
            <Sliders size={14} />
            <span>Inclusive Accessibility Controls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Voice & Accessibility Settings</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Customize voice recognition language, speech speed, audio feedback, and visual contrast modes.
          </p>
        </div>

        <div className="shrink-0">
          <TextToSpeech text={introSpeech} label="Listen to Guide" size="md" />
        </div>
      </div>

      {/* Main Settings Component (Requirement #55) */}
      <VoiceSettings />

      {/* Browser API Compatibility Notice (Requirement #59 & #60) */}
      <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 text-xs text-gray-400 space-y-2">
        <h4 className="font-bold text-gray-200 flex items-center gap-1.5 text-sm">
          <ShieldCheck size={16} className="text-emerald-400" />
          Native Browser Web Speech API Architecture
        </h4>
        <p className="leading-relaxed">
          WasteWise uses your browser's built-in <code className="text-emerald-300">SpeechRecognition</code> and <code className="text-emerald-300">SpeechSynthesis</code> APIs. No external commercial audio keys or paid subscriptions are required.
        </p>
        <p className="leading-relaxed text-gray-400">
          For the optimal voice experience, please grant microphone permissions when prompted and utilize modern browsers such as Google Chrome, Microsoft Edge, or Chromium-based browsers.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
