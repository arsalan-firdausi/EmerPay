import React, { useState, useEffect, useRef } from 'react';
import { PaymentStep, AppView, EMIPlan } from '../types';
import { VoiceOrb } from '../components/VoiceOrb';
import { CameraView } from '../components/CameraView';
import { generateAIResponse, calculateEMI } from '../services/geminiService';
import { ArrowLeft, Check, Mic, X, AlertTriangle, RefreshCw, History, CreditCard } from 'lucide-react';
import { EMI_PLANS, MOCK_TRANSACTIONS } from '../constants';

interface AIPaymentFlowProps {
  onClose: () => void;
}

interface ErrorState {
  title: string;
  message: string;
  canRetry: boolean;
}

export const AIPaymentFlow: React.FC<AIPaymentFlowProps> = ({ onClose }) => {
  const [step, setStep] = useState<PaymentStep>(PaymentStep.GREETING);
  const [voiceState, setVoiceState] = useState<'IDLE' | 'LISTENING' | 'SPEAKING' | 'PROCESSING'>('IDLE');
  const [messages, setMessages] = useState<string[]>([]);
  const [merchantName, setMerchantName] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [emiPlans, setEmiPlans] = useState<EMIPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  
  // Error Handling State
  const [error, setError] = useState<ErrorState | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Speak function
  const speak = (text: string) => {
    if (error) return; 
    setVoiceState('SPEAKING');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => {
      setVoiceState('IDLE');
      handleStepTransition(step, text);
    };
    utterance.onerror = () => {
       setVoiceState('IDLE');
    };
    window.speechSynthesis.speak(utterance);
    setMessages(prev => [...prev, text]);
  };

  const handleStepTransition = (currentStep: PaymentStep, lastSpoken: string) => {
    if (error) return;
    
    // Auto-transition logic based on what was just spoken or state
    if (currentStep === PaymentStep.GREETING) {
        setTimeout(() => setStep(PaymentStep.IDENTITY_VERIFICATION), 1000);
    }
  };

  const handleError = (title: string, message: string, fatal: boolean = false) => {
    setVoiceState('IDLE');
    window.speechSynthesis.cancel();
    setError({ title, message, canRetry: !fatal });
    
    const u = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(u);
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
    
    // Smart Retry Logic
    if (step === PaymentStep.IDENTITY_VERIFICATION) {
       verifyIdentity(); 
    } else if (step === PaymentStep.FINAL_VERIFICATION) {
       verifyFinalAuth();
    } else {
       // For voice/input errors, speak prompt again and then listen
       const lastMessage = messages[messages.length - 1] || "How can I help?";
       speak("Okay, let's try that again. " + lastMessage);
       // Note: We don't auto-trigger listening here to avoid loop, user must tap orb.
    }
  };

  const verifyIdentity = async () => {
      await new Promise(r => setTimeout(r, 2000)); 
      speak("Identity verified. How can I help you today?");
      setStep(PaymentStep.INTENT_DETECTION);
  };

  const verifyFinalAuth = async () => {
       await new Promise(r => setTimeout(r, 2500));

       // Simulated Biometric Failure (50% chance on first try for Demo)
       if (retryCount === 0 && Math.random() > 0.5) { 
           handleError("Biometric Match Failed", "I couldn't verify your face. Please remove any face coverings and try again.");
           return;
       }

       speak("Payment verified. Processing transaction.");
       setTimeout(() => {
           setStep(PaymentStep.SUCCESS);
       }, 2000);
  };


  // Main Effect to drive the state machine
  useEffect(() => {
    const runStep = async () => {
      if (voiceState !== 'IDLE' || error) return;

      switch (step) {
        case PaymentStep.GREETING:
          speak("Hello. I'm EmerPay. I'll help you make a secure payment.");
          break;
        
        case PaymentStep.IDENTITY_VERIFICATION:
           verifyIdentity();
           break;

        case PaymentStep.TRANSACTION_HISTORY:
           // Handled by the transition into this step usually, but safe fallback
           break;

        case PaymentStep.MERCHANT_SCAN:
          speak("Please point your camera at the merchant QR code.");
          setTimeout(() => {
            setMerchantName("Starbucks Coffee");
            speak("I see Starbucks Coffee. Is this correct?");
          }, 4000);
          break;

        case PaymentStep.AMOUNT_ENTRY:
          speak("How much would you like to pay?");
          break;

        case PaymentStep.EMI_SELECTION:
           if (amount && amount > 2000) {
             const plans = await calculateEMI(amount);
             setEmiPlans(plans.length ? plans : EMI_PLANS.map(p => ({
                ...p, 
                monthlyAmount: Math.floor(amount / p.tenure * (1 + p.rate/100/12 * p.tenure)),
                totalInterest: Math.floor(amount * (p.rate/100/12 * p.tenure)),
                totalPayable: Math.floor(amount * (1 + p.rate/100/12 * p.tenure))
             })));
             speak(`For ₹${amount}, you can pay instantly, or choose an EMI plan.`);
           } else {
             setStep(PaymentStep.FINAL_VERIFICATION);
           }
           break;

        case PaymentStep.FINAL_VERIFICATION:
          speak(`Confirming payment of ₹${amount} to ${merchantName}. Smile to authorize.`);
          setTimeout(() => {
             if (!error) verifyFinalAuth();
          }, 4000);
          break;
        
        case PaymentStep.SUCCESS:
          speak("Payment successful. Receipt sent to your email.");
          break;
      }
    };
    
    // Initial Trigger
    if (!error && ((step === PaymentStep.GREETING && messages.length === 0) || (step === PaymentStep.IDENTITY_VERIFICATION && messages.length === 1))) {
        runStep();
    }
    
  }, [step, error]);


  const handleVoiceInput = async (forcedInput?: string) => {
    if (voiceState === 'LISTENING' || error) return;
    setVoiceState('LISTENING');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVoiceState('PROCESSING');
      
      // Determine Mock Input
      let mockInput = forcedInput || "";
      if (!mockInput) {
        if (step === PaymentStep.INTENT_DETECTION) mockInput = "I want to pay this merchant";
        if (step === PaymentStep.MERCHANT_SCAN) mockInput = "Yes";
        if (step === PaymentStep.AMOUNT_ENTRY) mockInput = "Five Thousand Rupees";
        if (step === PaymentStep.EMI_SELECTION) mockInput = "I'll take the 3 month plan";
        if (step === PaymentStep.TRANSACTION_HISTORY) mockInput = "Go back";
      }

      const response = await generateAIResponse(step, mockInput);
      
      if (response.error) {
         handleError("Connection Failed", response.text);
         return;
      }

      // Handle Specific Actions
      if (response.action === 'SHOW_TRANSACTIONS') {
        setStep(PaymentStep.TRANSACTION_HISTORY);
        speak(response.text || "Showing your recent history.");
        return;
      }

      if (step === PaymentStep.TRANSACTION_HISTORY && response.action === 'NEXT_STEP') {
        setStep(PaymentStep.INTENT_DETECTION);
        speak(response.text || "Returning to main menu.");
        return;
      }

      // Default Flow Logic
      if (step === PaymentStep.INTENT_DETECTION) {
        setStep(PaymentStep.MERCHANT_SCAN);
        speak("Okay, opening scanner.");
      } else if (step === PaymentStep.MERCHANT_SCAN) {
        setStep(PaymentStep.AMOUNT_ENTRY);
        speak("Great.");
      } else if (step === PaymentStep.AMOUNT_ENTRY) {
         setAmount(5000);
         setStep(PaymentStep.EMI_SELECTION);
      } else if (step === PaymentStep.EMI_SELECTION) {
         setSelectedPlan(0);
         setStep(PaymentStep.FINAL_VERIFICATION);
      }

    } catch (e) {
      handleError("Voice Error", "I couldn't hear you clearly. Please check your internet.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
      {/* Background Camera Layer */}
      <CameraView 
        type={step === PaymentStep.MERCHANT_SCAN ? 'rear' : 'front'} 
        isActive={!error && step !== PaymentStep.TRANSACTION_HISTORY && (step === PaymentStep.IDENTITY_VERIFICATION || step === PaymentStep.MERCHANT_SCAN || step === PaymentStep.FINAL_VERIFICATION)} 
        overlayText={step === PaymentStep.IDENTITY_VERIFICATION ? "Align Face" : (step === PaymentStep.MERCHANT_SCAN ? "Scan QR" : "Authorizing...")}
        onError={(msg) => handleError("Camera Error", msg, true)}
      />

      {/* Foreground UI */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        {/* Top Bar */}
        <div className="p-4 flex justify-between items-center pointer-events-auto">
          <button onClick={onClose} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
            <X size={24} />
          </button>
          <div className={`px-3 py-1 backdrop-blur-md rounded-full border ${error ? 'bg-red-500/20 border-red-500/50' : 'bg-emerald-500/20 border-emerald-500/50'}`}>
            <span className={`${error ? 'text-red-400' : 'text-emerald-400'} text-xs font-bold tracking-wider`}>
              {error ? 'ATTENTION NEEDED' : 'SECURE SESSION'}
            </span>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            
           {/* ERROR STATE UI */}
           {error && (
             <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-red-500/50 flex flex-col items-center animate-scale-in max-w-sm pointer-events-auto shadow-2xl shadow-red-900/50">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 text-red-500">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{error.title}</h3>
                <p className="text-slate-300 mb-6">{error.message}</p>
                {error.canRetry && (
                  <button 
                    onClick={handleRetry}
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors"
                  >
                    <RefreshCw size={18} /> Try Again
                  </button>
                )}
             </div>
           )}

           {/* Normal Flow UI (Hidden if Error) */}
           {!error && (
             <>
                {step === PaymentStep.INTENT_DETECTION && (
                    <div className="flex gap-2 pointer-events-auto mt-4 animate-fade-in-up">
                        <button 
                            onClick={() => handleVoiceInput("Show my transaction history")}
                            className="px-4 py-2 bg-slate-800/80 backdrop-blur-md border border-slate-600 rounded-full text-xs text-emerald-400 flex items-center gap-2 hover:bg-slate-700"
                        >
                            <History size={14} /> Show History
                        </button>
                        <button 
                             onClick={() => handleVoiceInput("I want to pay a merchant")}
                             className="px-4 py-2 bg-slate-800/80 backdrop-blur-md border border-slate-600 rounded-full text-xs text-blue-400 flex items-center gap-2 hover:bg-slate-700"
                        >
                            <CreditCard size={14} /> Pay Merchant
                        </button>
                    </div>
                )}

                {step === PaymentStep.TRANSACTION_HISTORY && (
                    <div className="w-full max-w-sm bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden pointer-events-auto animate-scale-in">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                            <h3 className="font-bold text-white flex items-center gap-2"><History size={16} className="text-emerald-400"/> Recent Activity</h3>
                            <button onClick={() => handleVoiceInput("Go back")} className="text-xs text-slate-400 hover:text-white">Close</button>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            {MOCK_TRANSACTIONS.map((tx) => (
                                <div key={tx.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                                        {tx.merchant[0]}
                                        </div>
                                        <div className="text-left">
                                        <p className="font-medium text-sm text-white">{tx.merchant}</p>
                                        <p className="text-[10px] text-slate-500">{tx.date}</p>
                                        </div>
                                    </div>
                                    <p className={`font-mono font-medium text-sm ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-300'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 bg-emerald-500/10 text-center">
                             <p className="text-[10px] text-emerald-400">Say "Back" to return to menu</p>
                        </div>
                    </div>
                )}

                {step === PaymentStep.AMOUNT_ENTRY && merchantName && (
                  <div className="glass-panel p-6 rounded-2xl mb-8 animate-fade-in-up">
                      <p className="text-slate-400 text-sm">Paying</p>
                      <h2 className="text-2xl font-bold text-white">{merchantName}</h2>
                  </div>
                )}

                {amount && step !== PaymentStep.AMOUNT_ENTRY && step !== PaymentStep.TRANSACTION_HISTORY && (
                    <div className="mb-4">
                        <h1 className="text-5xl font-bold text-emerald-400">₹{amount.toLocaleString()}</h1>
                    </div>
                )}

                {step === PaymentStep.EMI_SELECTION && emiPlans.length > 0 && (
                  <div className="w-full max-w-sm pointer-events-auto space-y-3">
                    <div className="text-white font-medium mb-2 text-left">Say "Pay Full" or choose a plan:</div>
                    {emiPlans.map((plan, idx) => (
                      <button 
                        key={idx}
                        onClick={() => { setSelectedPlan(idx); setStep(PaymentStep.FINAL_VERIFICATION); }}
                        className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-700 flex justify-between items-center hover:border-emerald-500 transition-colors text-left"
                      >
                        <div>
                          <p className="text-emerald-400 font-bold">₹{plan.monthlyAmount}/mo</p>
                          <p className="text-xs text-slate-400">for {plan.tenure} months @ {plan.rate}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Total Interest</p>
                          <p className="text-sm text-slate-300">₹{plan.totalInterest}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === PaymentStep.SUCCESS && (
                  <div className="flex flex-col items-center animate-scale-in">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/50">
                      <Check size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Payment Sent</h2>
                    <p className="text-slate-400 mt-2">Transaction ID: #8823J9A</p>
                  </div>
                )}
             </>
           )}
        </div>

        {/* Bottom Interaction Area */}
        <div className="p-8 flex flex-col items-center pointer-events-auto bg-gradient-to-t from-black via-black/80 to-transparent">
          {/* Messages */}
          <div className="h-12 flex items-center justify-center mb-4">
            <p className="text-slate-300 text-lg font-medium text-center animate-pulse">
               {!error && (voiceState === 'SPEAKING' ? messages[messages.length - 1] : (voiceState === 'LISTENING' ? "Listening..." : "Tap mic to speak"))}
               {error && "System Paused"}
            </p>
          </div>

          {/* Orb / Mic Trigger */}
          <div onClick={() => handleVoiceInput()} className={`cursor-pointer transition-transform active:scale-95 ${error ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
             <VoiceOrb state={voiceState} />
          </div>
          
          <button className="mt-4 text-slate-500 text-sm flex items-center gap-2">
            <Mic size={14} /> {error ? 'AI Offline' : 'AI Voice Active'}
          </button>
        </div>
      </div>
    </div>
  );
};