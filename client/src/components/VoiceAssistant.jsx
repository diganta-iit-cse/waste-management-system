import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, X, Sparkles, Send, Volume2, HelpCircle } from 'lucide-react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { useVoice } from '../context/VoiceContext';
import VoiceWaveform from './VoiceWaveform';

const COMMAND_SUGGESTIONS = [
  'Classify my waste',
  'Find recycling centers',
  'Request a pickup',
  'Open dashboard',
  'Open my history',
  'Explain recyclable waste',
  'Open settings',
];

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const {
    language,
    speak,
    speakFeedback,
    isAssistantOpen,
    setIsAssistantOpen,
    speechToTextEnabled,
  } = useVoice();

  const [statusMessage, setStatusMessage] = useState('How can I help?');
  const [assistantSpokenReply, setAssistantSpokenReply] = useState('');
  const [manualInput, setManualInput] = useState('');

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  } = useSpeechRecognition();

  const handleCommandProcess = (commandText) => {
    if (!commandText || !commandText.trim()) return;

    const lower = commandText.toLowerCase().trim();
    stopListening();

    // 1. Classify
    if (lower.includes('classify') || lower.includes('identify') || lower.includes('scan')) {
      const reply = 'Opening waste classification.';
      setAssistantSpokenReply(reply);
      speak(reply);
      setTimeout(() => {
        setIsAssistantOpen(false);
        navigate('/classify');
      }, 1200);
      return;
    }

    // 2. Recycling Services / Kabadiwala
    if (
      lower.includes('recycling') ||
      lower.includes('recycling center') ||
      lower.includes('center') ||
      lower.includes('kabadiwala') ||
      lower.includes('scrap') ||
      lower.includes('raddi')
    ) {
      const reply = 'Opening recycling services.';
      setAssistantSpokenReply(reply);
      speak(reply);
      setTimeout(() => {
        setIsAssistantOpen(false);
        navigate('/services');
      }, 1200);
      return;
    }

    // 3. Pickup Request
    if (lower.includes('pickup') || lower.includes('schedule') || lower.includes('collect')) {
      const reply = 'Opening waste pickup request.';
      setAssistantSpokenReply(reply);
      speak(reply);
      setTimeout(() => {
        setIsAssistantOpen(false);
        navigate('/pickup');
      }, 1200);
      return;
    }

    // 4. History
    if (lower.includes('history') || lower.includes('past') || lower.includes('activity')) {
      const reply = 'Opening your activity and pickup history.';
      setAssistantSpokenReply(reply);
      speak(reply);
      setTimeout(() => {
        setIsAssistantOpen(false);
        navigate('/history');
      }, 1200);
      return;
    }

    // 5. Dashboard
    if (lower.includes('dashboard') || lower.includes('stats') || lower.includes('metric')) {
      const reply = 'Opening dashboard.';
      setAssistantSpokenReply(reply);
      speak(reply);
      setTimeout(() => {
        setIsAssistantOpen(false);
        navigate('/dashboard');
      }, 1200);
      return;
    }

    // 6. Settings
    if (lower.includes('setting') || lower.includes('preference') || lower.includes('voice setting')) {
      const reply = 'Opening voice and accessibility settings.';
      setAssistantSpokenReply(reply);
      speak(reply);
      setTimeout(() => {
        setIsAssistantOpen(false);
        navigate('/settings');
      }, 1200);
      return;
    }

    // 7. Explain Recyclable Waste
    if (lower.includes('explain') || lower.includes('what is recyclable') || lower.includes('recyclable waste')) {
      const reply =
        'Recyclable waste includes clean paper, cardboard, PET plastic bottles, glass jars, and metals like aluminum and tin. Make sure items are empty and rinsed dry before collection.';
      setAssistantSpokenReply(reply);
      speak(reply);
      return;
    }

    // 8. Help
    if (lower.includes('help')) {
      const reply =
        'You can say: Classify my waste, Find recycling centers, Request a pickup, Open dashboard, or Explain recyclable waste.';
      setAssistantSpokenReply(reply);
      speak(reply);
      return;
    }

    // Fallback: search services with spoken keywords
    const reply = `Searching recycling services for "${commandText}".`;
    setAssistantSpokenReply(reply);
    speak(reply);
    setTimeout(() => {
      setIsAssistantOpen(false);
      navigate(`/services?query=${encodeURIComponent(commandText)}`);
    }, 1200);
  };

  const handleOpenAssistant = () => {
    setIsAssistantOpen(true);
    setStatusMessage('Listening...');
    setAssistantSpokenReply('');
    resetTranscript();

    if (isSupported && speechToTextEnabled) {
      startListening({
        language,
        continuous: false,
        interimResults: true,
        onResult: (full) => {
          // auto process after short pause or user can hit process
        },
      });
    } else {
      setStatusMessage('How can I help? (Voice or Type)');
    }
  };

  const handleCloseAssistant = () => {
    stopListening();
    setIsAssistantOpen(false);
  };

  const currentDisplaySpeech = transcript || interimTranscript || manualInput;

  return (
    <>
      {/* Floating Action Button (Requirement #52: Bottom-right corner) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={handleOpenAssistant}
          aria-label="Open WasteWise Voice Assistant"
          className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 text-white shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-emerald-300/40 focus:outline-none focus:ring-4 focus:ring-emerald-400"
        >
          <Mic size={28} className="group-hover:scale-110 transition-transform animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white"></span>
          </span>
          <span className="sr-only">Voice Assistant</span>
        </button>
      </div>

      {/* Modern Floating Assistant UI (Requirement #53) */}
      {isAssistantOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-gray-900 border border-emerald-500/40 shadow-2xl p-6 sm:p-7 overflow-hidden text-gray-100 flex flex-col gap-5">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Mic size={22} className={isListening ? 'animate-bounce text-emerald-300' : ''} />
                </div>
                <div>
                  <h2 id="assistant-title" className="text-lg font-bold text-white flex items-center gap-2">
                    WasteWise Voice Assistant
                    <Sparkles size={16} className="text-amber-400 animate-spin-slow" />
                  </h2>
                  <p className="text-xs text-emerald-400/90 font-medium">
                    {isListening ? 'Listening...' : statusMessage}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseAssistant}
                aria-label="Close Voice Assistant"
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Waveform Animation (Requirement #53) */}
            <div className="flex flex-col items-center justify-center py-4 bg-gray-950/60 rounded-2xl border border-gray-800">
              <VoiceWaveform active={isListening} bars={9} className="h-10 mb-2" />
              <p className="text-xs text-gray-400 tracking-wide font-medium">
                {isListening ? 'Speak naturally into your microphone...' : 'Microphone idle'}
              </p>
            </div>

            {/* Recognized Speech Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Recognized Speech:
              </label>
              <div className="min-h-[56px] p-3 rounded-xl bg-gray-950 border border-emerald-500/30 text-gray-100 text-sm flex items-center justify-between">
                <span className={currentDisplaySpeech ? 'text-white font-medium' : 'text-gray-500 italic'}>
                  {currentDisplaySpeech || '"Find recycling centers" or "Classify my waste"'}
                </span>
                {currentDisplaySpeech && (
                  <button
                    type="button"
                    onClick={() => {
                      resetTranscript();
                      setManualInput('');
                    }}
                    className="text-xs text-gray-400 hover:text-gray-200 ml-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Assistant Spoken Response if any */}
            {assistantSpokenReply && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-sm flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <Volume2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <p className="font-medium text-emerald-100">{assistantSpokenReply}</p>
              </div>
            )}

            {/* Suggested Commands Chips */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Try saying or tap:</p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {COMMAND_SUGGESTIONS.map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => {
                      setTranscript(cmd);
                      handleCommandProcess(cmd);
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-gray-800/80 hover:bg-emerald-900/60 hover:text-emerald-300 text-gray-300 border border-gray-700 hover:border-emerald-500/50 transition-colors"
                  >
                    "{cmd}"
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons: [Cancel] [Process / Search] */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseAssistant}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening({ language });
                  }
                }}
                className={`py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 transition-colors ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50'
                }`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isListening ? 'Stop' : 'Listen'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCommandProcess(currentDisplaySpeech)}
                disabled={!currentDisplaySpeech.trim()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Send size={15} />
                <span>Process / Search</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
