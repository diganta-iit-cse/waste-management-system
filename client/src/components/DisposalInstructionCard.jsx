import React from 'react';
import { Trash2, AlertTriangle, CheckCircle, Info, Sparkles } from 'lucide-react';
import TextToSpeech from './TextToSpeech';

const DisposalInstructionCard = ({
  title,
  category,
  instructions,
  preparation,
  binColor = 'Blue',
  environmentalImpact,
  className = '',
}) => {
  const speechContent = `Disposal instructions for ${title}: Category is ${category}. How to dispose: ${instructions}. Preparation steps: ${preparation}. Place into the ${binColor} waste container.`;

  return (
    <div
      className={`rounded-2xl p-5 bg-gray-900/85 border border-emerald-500/30 hover:border-emerald-500/60 transition-all shadow-xl backdrop-blur-md flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header with Title and Listen button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50">
              {category}
            </span>
            <h4 className="text-base font-bold text-white mt-1.5">{title}</h4>
          </div>
          {/* Requirement #47: 🔊 Listen button */}
          <TextToSpeech text={speechContent} label="Listen" size="sm" />
        </div>

        {/* Instructions Body */}
        <div className="space-y-2.5 text-xs sm:text-sm text-gray-300">
          <div className="p-2.5 rounded-xl bg-gray-950/70 border border-gray-800">
            <span className="font-semibold text-emerald-400 block mb-0.5">How to dispose:</span>
            <span>{instructions}</span>
          </div>

          {preparation && (
            <div className="p-2.5 rounded-xl bg-gray-950/70 border border-gray-800">
              <span className="font-semibold text-teal-400 block mb-0.5">Preparation:</span>
              <span>{preparation}</span>
            </div>
          )}

          {environmentalImpact && (
            <div className="text-xs text-gray-400 flex items-start gap-1.5 pt-1">
              <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <span>{environmentalImpact}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bin Assignment */}
      <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
        <span className="text-gray-400">Recommended Bin:</span>
        <span className="font-bold text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-600/40">
          {binColor} Bin
        </span>
      </div>
    </div>
  );
};

export default DisposalInstructionCard;
