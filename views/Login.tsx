import React from 'react';
import { AppView } from '../types';
import { Fingerprint, Lock, MessageSquareDot } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="h-full flex flex-col justify-between p-8 bg-slate-900 relative overflow-hidden">
      
      <div className="mt-12 relative z-10">
        <h1 className="text-5xl font-bold text-white mb-2">EmerPay</h1>
        <p className="text-emerald-400 text-lg">Future of Payments</p>
      </div>

      <div className="flex flex-col gap-4 relative z-10 mb-12">
        <button className="h-16 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl flex items-center justify-center gap-3 text-slate-300 font-medium hover:bg-slate-700 transition-colors">
          <Lock size={20} /> Use PIN
        </button>
        <button className="h-16 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl flex items-center justify-center gap-3 text-slate-300 font-medium hover:bg-slate-700 transition-colors">
          <MessageSquareDot size={20} /> Use OTP
        </button>
        <button 
          onClick={onLogin}
          className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center gap-3 text-white font-bold text-lg shadow-lg shadow-emerald-900/50 hover:scale-[1.02] transition-transform"
        >
          <Fingerprint size={24} /> BIOMETRIC LOGIN
        </button>
      </div>

      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
    </div>
  );
};
