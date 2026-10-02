import React, { useState } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { useVoice } from '../context/VoiceContext';

const VoiceInput = ({
  onTranscript,
  value = '',
  append = false,
  continuous = false,
  language: customLanguage,
  label,
  size = 'md',
  className = '',
  buttonOnly = true,
}) => {
  const { language: contextLanguage, speechToTextEnabled } = useVoice();
  const activeLanguage = customLanguage || contextLanguage;

  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const [errorMessage, setErrorMessage] = useState('');

  const toggleListening = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!speechToTextEnabled) {
      setErrorMessage('Speech-to-Text is currently disabled in Voice Settings.');
      setTimeout(() => setErrorMessage(''), 4000);
      return;
    }

    if (!isSupported) {
      setErrorMessage(
        'Speech recognition is not supported in this browser. Please try Chrome, Edge, or a compatible browser.'
      );
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      setErrorMessage('');
      resetTranscript();

      const ok = startListening({
        language: activeLanguage,
        continuous,
        interimResults: true,
        onResult: (fullText, finalChunk) => {
          if (onTranscript) {
            if (append && value) {
              onTranscript(`${value.trim()} ${finalChunk}`.trim());
            } else {
              onTranscript(fullText);
            }
          }
        },
        onError: (err) => {
          setErrorMessage(err);
          setTimeout(() => setErrorMessage(''), 5000);
        },
      });

      if (!ok) {
        setErrorMessage('Could not activate microphone. Check browser permissions.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  };

  const iconSizes = {
    sm: 15,
    md: 18,
    lg: 22,
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        title={
          isListening
            ? 'Stop Listening'
            : isSupported
            ? 'Start Listening (Speech-to-Text)'
            : 'Speech recognition unsupported'
        }
        aria-label={
          isListening
            ? 'Stop voice recording'
            : label || 'Start speech-to-text input'
        }
        className={`group relative inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
          sizeClasses[size]
        } ${
          isListening
            ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/40 animate-pulse ring-2 ring-rose-400'
            : 'bg-emerald-950/70 hover:bg-emerald-800/80 text-emerald-300 hover:text-white border border-emerald-600/40 hover:border-emerald-500'
        }`}
      >
        {isListening ? (
          <>
            <MicOff size={iconSizes[size]} className="animate-spin-slow text-white" />
            {!buttonOnly && <span className="font-semibold text-xs tracking-wide">Listening...</span>}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          </>
        ) : (
          <>
            <Mic size={iconSizes[size]} className="group-hover:scale-110 transition-transform duration-150" />
            {!buttonOnly && (
              <span className="text-xs font-medium">
                {label || 'Speak'}
              </span>
            )}
          </>
        )}
      </button>

      {/* Realtime spoken interim feedback popup */}
      {isListening && interimTranscript && (
        <div
          role="status"
          aria-live="polite"
          className="absolute z-30 bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-gray-900/95 border border-emerald-500/50 text-emerald-200 text-xs shadow-xl backdrop-blur-md"
        >
          <span className="text-emerald-400 font-semibold mr-1">Heard:</span>
          "{interimTranscript}"
        </div>
      )}

      {/* Error notification tooltip */}
      {(errorMessage || error) && (
        <div
          role="alert"
          className="absolute z-40 top-full mt-2 left-0 right-auto min-w-[240px] max-w-xs p-2.5 rounded-lg bg-red-950/95 border border-red-500/80 text-red-200 text-xs shadow-2xl flex items-start gap-2 backdrop-blur-md"
        >
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage || error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
