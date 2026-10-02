import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useTextToSpeech from '../hooks/useTextToSpeech';

const VoiceContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English (India)', native: 'English' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export const VoiceProvider = ({ children }) => {
  // Load initial preferences from localStorage
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('wastewise_lang') || 'en-IN';
  });

  const [speechToTextEnabled, setSpeechToTextEnabledState] = useState(() => {
    const saved = localStorage.getItem('wastewise_stt');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [textToSpeechEnabled, setTextToSpeechEnabledState] = useState(() => {
    const saved = localStorage.getItem('wastewise_tts');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [autoVoiceFeedback, setAutoVoiceFeedbackState] = useState(() => {
    const saved = localStorage.getItem('wastewise_feedback');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [speechRate, setSpeechRateState] = useState(() => {
    const saved = localStorage.getItem('wastewise_rate');
    return saved !== null ? parseFloat(saved) : 1.0;
  });

  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('wastewise_volume');
    return saved !== null ? parseFloat(saved) : 1.0;
  });

  const [accessibilityMode, setAccessibilityModeState] = useState(() => {
    const saved = localStorage.getItem('wastewise_a11y');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Assistant modal visibility
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Global TTS controller
  const tts = useTextToSpeech();

  // Apply accessibility class to html root
  useEffect(() => {
    if (accessibilityMode) {
      document.documentElement.classList.add('accessibility-mode');
    } else {
      document.documentElement.classList.remove('accessibility-mode');
    }
  }, [accessibilityMode]);

  // Setters with persistent storage
  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem('wastewise_lang', langCode);
  };

  const setSpeechToTextEnabled = (enabled) => {
    setSpeechToTextEnabledState(enabled);
    localStorage.setItem('wastewise_stt', JSON.stringify(enabled));
  };

  const setTextToSpeechEnabled = (enabled) => {
    setTextToSpeechEnabledState(enabled);
    localStorage.setItem('wastewise_tts', JSON.stringify(enabled));
    if (!enabled) {
      tts.stop();
    }
  };

  const setAutoVoiceFeedback = (enabled) => {
    setAutoVoiceFeedbackState(enabled);
    localStorage.setItem('wastewise_feedback', JSON.stringify(enabled));
  };

  const setSpeechRate = (rate) => {
    const num = parseFloat(rate);
    setSpeechRateState(num);
    localStorage.setItem('wastewise_rate', num.toString());
  };

  const setVolume = (vol) => {
    const num = parseFloat(vol);
    setVolumeState(num);
    localStorage.setItem('wastewise_volume', num.toString());
  };

  const toggleAccessibilityMode = () => {
    setAccessibilityModeState((prev) => {
      const next = !prev;
      localStorage.setItem('wastewise_a11y', JSON.stringify(next));
      return next;
    });
  };

  // Speak with global settings applied
  const speak = useCallback(
    (text, overrides = {}) => {
      if (!textToSpeechEnabled) return;
      tts.speak(text, {
        lang: overrides.lang || language,
        rate: overrides.rate ?? speechRate,
        volume: overrides.volume ?? volume,
        ...overrides,
      });
    },
    [textToSpeechEnabled, language, speechRate, volume, tts]
  );

  // Automatic voice feedback (used on classification, pickup, login, errors)
  const speakFeedback = useCallback(
    (text) => {
      if (autoVoiceFeedback && textToSpeechEnabled && text) {
        speak(text);
      }
    },
    [autoVoiceFeedback, textToSpeechEnabled, speak]
  );

  const value = {
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
    isAssistantOpen,
    setIsAssistantOpen,
    tts,
    speak,
    speakFeedback,
    stopSpeaking: tts.stop,
    pauseSpeaking: tts.pause,
    resumeSpeaking: tts.resume,
    isSpeaking: tts.isSpeaking,
    isPaused: tts.isPaused,
    currentSpokenText: tts.currentText,
    isTTSSupported: tts.isSupported,
  };

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

export default VoiceContext;
