import React from 'react';

const VoiceWaveform = ({ active = false, bars = 5, className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-1.5 h-8 ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, index) => {
        // Generate staggered delays and heights
        const delays = ['0ms', '150ms', '300ms', '100ms', '250ms', '350ms', '200ms'];
        const delay = delays[index % delays.length];

        return (
          <span
            key={index}
            style={{
              animationDelay: delay,
              transition: 'all 0.3s ease-in-out',
            }}
            className={`w-1 rounded-full ${
              active
                ? 'bg-emerald-400 animate-waveform shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                : 'h-2 bg-emerald-700/40'
            }`}
          />
        );
      })}
    </div>
  );
};

export default VoiceWaveform;
