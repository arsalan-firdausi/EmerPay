import React from 'react';

interface VoiceOrbProps {
  state: 'IDLE' | 'LISTENING' | 'SPEAKING' | 'PROCESSING';
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ state }) => {
  const getColor = () => {
    switch (state) {
      case 'IDLE': return 'bg-slate-600';
      case 'LISTENING': return 'bg-emerald-400';
      case 'SPEAKING': return 'bg-amber-400';
      case 'PROCESSING': return 'bg-purple-500';
    }
  };

  return (
    <div className="relative flex items-center justify-center w-24 h-24 my-6">
      {(state === 'LISTENING' || state === 'SPEAKING') && (
        <div className={`pulse-ring ${state === 'SPEAKING' ? 'border-amber-400' : 'border-emerald-400'}`}></div>
      )}
      {(state === 'PROCESSING') && (
        <div className="absolute w-full h-full border-2 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
      )}
      <div className={`w-16 h-16 rounded-full shadow-lg transition-all duration-500 ${getColor()} bg-opacity-90 backdrop-blur-sm z-10 flex items-center justify-center`}>
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full"></div>
      </div>
    </div>
  );
};
