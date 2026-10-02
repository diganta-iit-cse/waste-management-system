import React from 'react';
import { Volume2, VolumeX, Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';

const TextToSpeech = ({
  text,
  label = 'Listen',
  showControls = false,
  size = 'md',
  className = '',
  iconOnly = false,
}) => {
  const {
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    isSpeaking,
    isPaused,
    currentSpokenText,
    textToSpeechEnabled,
    isTTSSupported,
  } = useVoice();

  // Check if this specific instance is currently being spoken
  const isCurrent = isSpeaking && currentSpokenText === text;
  const isCurrentPaused = isPaused && currentSpokenText === text;

  const handleSpeak = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!textToSpeechEnabled || !text) return;

    if (isCurrent) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  const handlePause = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    pauseSpeaking();
  };

  const handleResume = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    resumeSpeaking();
  };

  const handleStop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    stopSpeaking();
  };

  if (!isTTSSupported) {
    return null;
  }

  // Size styling
  const sizeMap = {
    sm: { btn: 'px-2 py-1 text-xs', icon: 14, gap: 'gap-1' },
    md: { btn: 'px-3 py-1.5 text-sm', icon: 17, gap: 'gap-1.5' },
    lg: { btn: 'px-4 py-2.5 text-base font-semibold', icon: 20, gap: 'gap-2' },
  };
  const config = sizeMap[size] || sizeMap.md;

  // Full Control Bar Mode (Requirement #46: Speak, Pause, Resume, Stop)
  if (showControls) {
    return (
      <div
        className={`inline-flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-gray-900/80 border border-emerald-500/30 backdrop-blur-md ${className}`}
        role="group"
        aria-label="Text to speech audio controls"
      >
        {/* Speak / Restart */}
        <button
          type="button"
          onClick={handleSpeak}
          title={isCurrent ? 'Restart Audio' : 'Speak'}
          className={`inline-flex items-center gap-1.5 ${config.btn} rounded-lg font-medium transition-all ${
            isCurrent && !isCurrentPaused
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400'
              : 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50'
          }`}
        >
          {isCurrent && !isCurrentPaused ? (
            <>
              <Volume2 size={config.icon} className="animate-bounce" />
              <span>Speaking...</span>
            </>
          ) : (
            <>
              <Play size={config.icon} className="fill-current" />
              <span>{label || 'Speak'}</span>
            </>
          )}
        </button>

        {/* Pause Button */}
        <button
          type="button"
          onClick={handlePause}
          disabled={!isCurrent || isCurrentPaused}
          title="Pause Audio"
          className={`inline-flex items-center gap-1 ${config.btn} rounded-lg transition-colors ${
            isCurrent && !isCurrentPaused
              ? 'bg-amber-950/80 hover:bg-amber-800 text-amber-200 border border-amber-600/60'
              : 'bg-gray-800/40 text-gray-500 border border-gray-700/40 cursor-not-allowed opacity-50'
          }`}
        >
          <Pause size={config.icon} />
          <span className="hidden sm:inline">Pause</span>
        </button>

        {/* Resume Button */}
        <button
          type="button"
          onClick={handleResume}
          disabled={!isCurrentPaused}
          title="Resume Audio"
          className={`inline-flex items-center gap-1 ${config.btn} rounded-lg transition-colors ${
            isCurrentPaused
              ? 'bg-teal-700 hover:bg-teal-600 text-white animate-pulse ring-2 ring-teal-400'
              : 'bg-gray-800/40 text-gray-500 border border-gray-700/40 cursor-not-allowed opacity-50'
          }`}
        >
          <Play size={config.icon} className="fill-current" />
          <span className="hidden sm:inline">Resume</span>
        </button>

        {/* Stop Button */}
        <button
          type="button"
          onClick={handleStop}
          disabled={!isSpeaking}
          title="Stop Audio"
          className={`inline-flex items-center gap-1 ${config.btn} rounded-lg transition-colors ${
            isSpeaking
              ? 'bg-rose-950/80 hover:bg-rose-800 text-rose-200 border border-rose-600/60'
              : 'bg-gray-800/40 text-gray-500 border border-gray-700/40 cursor-not-allowed opacity-50'
          }`}
        >
          <Square size={config.icon} className="fill-current" />
          <span className="hidden sm:inline">Stop</span>
        </button>
      </div>
    );
  }

  // Compact Single Button Mode (Requirement #45, #47, #48)
  return (
    <button
      type="button"
      onClick={handleSpeak}
      title={isCurrent ? 'Stop Reading' : `Listen: ${label || 'Text-to-speech'}`}
      aria-label={`Listen to ${label || 'text'}`}
      className={`inline-flex items-center justify-center ${config.gap} rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
        iconOnly ? 'p-2' : config.btn
      } ${
        isCurrent
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-300 animate-pulse'
          : 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-600/40 hover:border-emerald-500'
      } ${className}`}
    >
      {isCurrent ? (
        <>
          <Volume2 size={config.icon} className="animate-spin-slow text-white" />
          {!iconOnly && <span>Playing...</span>}
        </>
      ) : (
        <>
          <Volume2 size={config.icon} className="group-hover:scale-110" />
          {!iconOnly && <span>{label}</span>}
        </>
      )}
    </button>
  );
};

export default TextToSpeech;
