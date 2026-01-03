export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  AI_PAYMENT = 'AI_PAYMENT',
  OFFLINE_PAYMENT = 'OFFLINE_PAYMENT',
  BIOMETRIC_PAYMENT = 'BIOMETRIC_PAYMENT',
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  type: 'debit' | 'credit';
}

export interface EMIPlan {
  tenure: number; // months
  rate: number; // percentage
  monthlyAmount: number;
  totalInterest: number;
  totalPayable: number;
}

export interface AIResponse {
  text: string;
  action?: 'NEXT_STEP' | 'CONFIRM_PAYMENT' | 'ASK_AMOUNT' | 'SCAN_QR' | 'SHOW_TRANSACTIONS' | 'NONE';
  data?: any;
  error?: boolean;
}

export enum PaymentStep {
  GREETING = 'GREETING',
  IDENTITY_VERIFICATION = 'IDENTITY_VERIFICATION',
  INTENT_DETECTION = 'INTENT_DETECTION',
  TRANSACTION_HISTORY = 'TRANSACTION_HISTORY',
  MERCHANT_SCAN = 'MERCHANT_SCAN',
  AMOUNT_ENTRY = 'AMOUNT_ENTRY',
  EMI_SELECTION = 'EMI_SELECTION',
  FINAL_VERIFICATION = 'FINAL_VERIFICATION',
  SUCCESS = 'SUCCESS',
}