import React, { useState } from 'react';
import { SUPER_APP_ITEMS, MOCK_TRANSACTIONS } from '../constants';
import { LayoutDashboard, Mic, Send, QrCode, WifiOff, Fingerprint, Menu, Bell } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppView } from '../types';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

const data = [
  { name: 'Mon', amt: 4000 },
  { name: 'Tue', amt: 3000 },
  { name: 'Wed', amt: 2000 },
  { name: 'Thu', amt: 2780 },
  { name: 'Fri', amt: 1890 },
  { name: 'Sat', amt: 2390 },
  { name: 'Sun', amt: 3490 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-white relative overflow-y-auto pb-20">
      {/* Header */}
      <div className="p-6 pt-10 flex justify-between items-center sticky top-0 z-20 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
        <div>
          <h1 className="text-sm text-slate-400 font-medium">Welcome back,</h1>
          <h2 className="text-2xl font-bold text-emerald-400">Arjun</h2>
        </div>
        <div className="p-2 bg-slate-800 rounded-full relative">
          <Bell size={20} className="text-slate-400" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate(AppView.AI_PAYMENT)}
          className="col-span-2 bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 rounded-2xl shadow-lg shadow-emerald-900/40 flex items-center justify-between group active:scale-95 transition-all"
        >
          <div className="text-left">
            <p className="text-emerald-100 text-sm">Tap to Speak</p>
            <h3 className="text-xl font-bold">Pay with AI</h3>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mic className="text-white" size={24} />
          </div>
        </button>

        <button 
          onClick={() => onNavigate(AppView.OFFLINE_PAYMENT)}
          className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <WifiOff className="text-amber-400" size={24} />
          <span className="text-sm font-medium">Offline Pay</span>
        </button>

        <button 
          onClick={() => onNavigate(AppView.BIOMETRIC_PAYMENT)}
          className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Fingerprint className="text-purple-400" size={24} />
          <span className="text-sm font-medium">Biometric</span>
        </button>
      </div>

      {/* Super App Grid */}
      <div className="px-6 py-2">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Your Finances</h3>
        <div className="grid grid-cols-2 gap-3">
          {SUPER_APP_ITEMS.map((item, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <item.icon className={item.color} size={20} />
                <span className="text-xs text-slate-500">...</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs">{item.name}</p>
                <p className="text-lg font-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Graph */}
      <div className="px-6 py-6">
         <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Weekly Spend</h3>
         <div className="h-48 glass-panel rounded-xl p-2 border border-slate-800">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={data}>
               <defs>
                 <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} itemStyle={{ color: '#fff' }} />
               <Area type="monotone" dataKey="amt" stroke="#34d399" fillOpacity={1} fill="url(#colorAmt)" />
             </AreaChart>
           </ResponsiveContainer>
         </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6 pb-24">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Recent Transactions</h3>
        <div className="flex flex-col gap-3">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  {tx.merchant[0]}
                </div>
                <div>
                  <p className="font-medium">{tx.merchant}</p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
              </div>
              <p className={`font-mono font-medium ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'}`}>
                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav Mock */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 p-4 flex justify-around items-center z-50">
        <div className="text-emerald-400 flex flex-col items-center">
          <LayoutDashboard size={24} />
          <span className="text-[10px] mt-1">Home</span>
        </div>
        <div className="text-slate-600 flex flex-col items-center">
           <QrCode size={24} />
           <span className="text-[10px] mt-1">Scan</span>
        </div>
        <div className="text-slate-600 flex flex-col items-center">
           <Menu size={24} />
           <span className="text-[10px] mt-1">More</span>
        </div>
      </div>
    </div>
  );
};