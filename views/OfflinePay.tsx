import React, { useState, useEffect } from 'react';
import { ArrowLeft, WifiOff, Smartphone, CheckCircle } from 'lucide-react';
import { AppView } from '../types';

interface OfflinePayProps {
  onBack: () => void;
}

export const OfflinePay: React.FC<OfflinePayProps> = ({ onBack }) => {
  const [state, setState] = useState<'GENERATING' | 'BROADCASTING' | 'SUCCESS'>('GENERATING');

  useEffect(() => {
    setTimeout(() => setState('BROADCASTING'), 2000);
    setTimeout(() => setState('SUCCESS'), 6000);
  }, []);

  return (
    <div className="h-full bg-slate-900 text-white flex flex-col relative overflow-hidden">
      <div className="p-4 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400">
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2 mb-12">
            <WifiOff size={16} className="text-amber-500" />
            <span className="text-sm font-medium text-amber-500">Offline Mode Active</span>
        </div>

        {state === 'GENERATING' && (
           <div className="text-center">
             <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin mx-auto mb-6"></div>
             <h2 className="text-xl font-bold">Generating Secure Token...</h2>
             <p className="text-slate-500 mt-2">Creating device-bound crypto key</p>
           </div>
        )}

        {state === 'BROADCASTING' && (
            <div className="relative w-64 h-64 flex items-center justify-center">
               <div className="absolute w-full h-full bg-emerald-500/10 rounded-full animate-ping"></div>
               <div className="absolute w-48 h-48 bg-emerald-500/20 rounded-full animate-pulse"></div>
               
               <div className="relative z-10 bg-slate-800 p-6 rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 w-48 aspect-[3/4] flex flex-col justify-between">
                  <div className="flex justify-between items-center opacity-50">
                    <Smartphone size={20} />
                    <WifiOff size={16} />
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white tracking-widest">₹500</p>
                    <p className="text-xs text-slate-400 mt-2">Tap merchant device</p>
                  </div>
                  <div className="h-1 bg-slate-700 rounded overflow-hidden">
                    <div className="h-full bg-emerald-400 animate-progress-bar w-full origin-left"></div>
                  </div>
               </div>
            </div>
        )}

        {state === 'SUCCESS' && (
           <div className="text-center animate-scale-in">
             <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-emerald-500/50">
                <CheckCircle size={40} />
             </div>
             <h2 className="text-2xl font-bold">Token Transferred</h2>
             <p className="text-slate-400 mt-2">Merchant will sync when online.</p>
             <p className="text-xs text-slate-600 mt-8">Secure Hash: 0x829...912A</p>
           </div>
        )}
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>
    </div>
  );
};
