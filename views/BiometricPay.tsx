import React, { useState, useEffect } from 'react';
import { ArrowLeft, Fingerprint, ScanFace } from 'lucide-react';
import { AppView } from '../types';

interface BiometricPayProps {
  onBack: () => void;
}

export const BiometricPay: React.FC<BiometricPayProps> = ({ onBack }) => {
  return (
    <div className="h-full bg-slate-900 text-white flex flex-col">
       <div className="p-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400">
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
         <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center mb-8 relative">
             <Fingerprint size={64} className="text-purple-400" />
             <div className="absolute -right-2 -top-2 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center border-4 border-slate-900">
               <ScanFace size={20} className="text-blue-400" />
             </div>
         </div>

         <h2 className="text-2xl font-bold mb-4">Complete at Merchant POS</h2>
         <p className="text-slate-400 leading-relaxed max-w-xs">
           This transaction requires biometric authorization on the merchant's secure terminal.
         </p>

         <div className="mt-12 w-full max-w-xs bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-600">
            <p className="text-xs text-slate-500 mb-2 font-mono uppercase tracking-widest">Your Identity ID</p>
            <p className="text-xl font-mono text-emerald-400 font-bold tracking-wider">EMP-992-12X</p>
         </div>

         <div className="mt-auto mb-8 flex items-center gap-2 text-xs text-slate-600">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           Listening for merchant request...
         </div>
      </div>
    </div>
  );
};
