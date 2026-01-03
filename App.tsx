import React, { useState } from 'react';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { AIPaymentFlow } from './views/AIPaymentFlow';
import { OfflinePay } from './views/OfflinePay';
import { BiometricPay } from './views/BiometricPay';
import { AppView } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [showAIPayModal, setShowAIPayModal] = useState(false);

  const handleNavigate = (view: AppView) => {
    if (view === AppView.AI_PAYMENT) {
      setShowAIPayModal(true);
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center font-sans">
      {/* Mobile Frame Simulation for Desktop Viewers */}
      <div className="w-full h-full sm:max-w-[400px] sm:h-[850px] sm:rounded-3xl relative overflow-hidden bg-slate-900 shadow-2xl border border-slate-800">
        
        {currentView === AppView.LOGIN && (
          <Login onLogin={() => setCurrentView(AppView.DASHBOARD)} />
        )}

        {currentView === AppView.DASHBOARD && (
          <Dashboard onNavigate={handleNavigate} />
        )}

        {currentView === AppView.OFFLINE_PAYMENT && (
          <OfflinePay onBack={() => setCurrentView(AppView.DASHBOARD)} />
        )}

        {currentView === AppView.BIOMETRIC_PAYMENT && (
          <BiometricPay onBack={() => setCurrentView(AppView.DASHBOARD)} />
        )}

        {/* AI Modal Overlay */}
        {showAIPayModal && (
          <AIPaymentFlow onClose={() => setShowAIPayModal(false)} />
        )}

      </div>
    </div>
  );
}
