import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from '../types';

// Safely retrieve the API key to avoid "process is not defined" ReferenceError
const getApiKey = () => {
  try {
    // @ts-ignore
    return (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const generateAIResponse = async (
  context: string,
  userEffectiveInput: string
): Promise<AIResponse> => {
  // Graceful Demo Mode Handling
  if (!apiKey) {
    const input = userEffectiveInput.toLowerCase();
    
    // Simulate delays for realism
    await new Promise(r => setTimeout(r, 1000));

    if (input.includes("history") || input.includes("transaction")) {
        return {
            text: "Here are your recent transactions. You spent 450 rupees at Starbucks today.",
            action: 'SHOW_TRANSACTIONS',
            error: false
        };
    }
    
    // Fallback Mock Logic
    return { 
      text: "Demo Mode: API Key missing. Simulating AI response. " + context,
      action: 'NONE',
      error: false 
    };
  }

  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `
      You are EmerPay AI, a futuristic, polite, and efficient fintech assistant.
      Your tone is confident, reassuring, and concise.
      You are guiding a user through a payment flow.
      
      Current Context: ${context}
      
      If the user asks to see history, transactions, or spending, set action to 'SHOW_TRANSACTIONS'.
      If the user wants to go back or return, set action to 'NEXT_STEP' (which usually maps to reset/intent).
      
      Respond in JSON format:
      {
        "text": "The spoken response to the user (under 20 words)",
        "action": "One of: NEXT_STEP, CONFIRM_PAYMENT, ASK_AMOUNT, SCAN_QR, SHOW_TRANSACTIONS, NONE"
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: userEffectiveInput,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            action: { type: Type.STRING },
          }
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    return {
      text: json.text || "I didn't catch that, could you repeat?",
      action: json.action || 'NONE',
      error: false
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: "I'm having trouble connecting to the secure server. Please check your internet connection and try again.", 
      action: 'NONE',
      error: true
    };
  }
};

export const calculateEMI = async (amount: number): Promise<any> => {
  if (!apiKey) return null;
  
  try {
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Calculate 3 EMI options for a loan of ₹${amount}. 
      Option 1: 3 months, 12% pa.
      Option 2: 6 months, 14% pa.
      Option 3: 9 months, 15% pa.
      Return strictly JSON array of objects with keys: tenure (number), rate (number), monthlyAmount (number, rounded), totalInterest (number, rounded).`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error(e);
    return [];
  }
}