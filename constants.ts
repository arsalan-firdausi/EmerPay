import { Transaction } from './types';
import { LayoutDashboard, WifiOff, ScanFace, CreditCard, Landmark, Banknote, ShieldCheck } from 'lucide-react';

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', merchant: 'Starbucks Premium', amount: 450, date: 'Today, 10:23 AM', category: 'Food', type: 'debit' },
  { id: '2', merchant: 'Uber Trip', amount: 320, date: 'Yesterday, 6:45 PM', category: 'Transport', type: 'debit' },
  { id: '3', merchant: 'Salary Credit', amount: 125000, date: 'Oct 30', category: 'Salary', type: 'credit' },
  { id: '4', merchant: 'Apple Store', amount: 89900, date: 'Oct 28', category: 'Electronics', type: 'debit' },
];

export const SUPER_APP_ITEMS = [
  { name: 'Bank Balance', icon: Landmark, color: 'text-emerald-400', value: '₹2,45,000' },
  { name: 'UPI Lite', icon: ScanFace, color: 'text-blue-400', value: '₹1,500' },
  { name: 'Investments', icon: Banknote, color: 'text-purple-400', value: '₹12.5L' },
  { name: 'Credit Score', icon: ShieldCheck, color: 'text-amber-400', value: '785' },
];

export const EMI_PLANS = [
  { tenure: 3, rate: 12, monthlyAmount: 0, totalInterest: 0, totalPayable: 0 },
  { tenure: 6, rate: 13.5, monthlyAmount: 0, totalInterest: 0, totalPayable: 0 },
  { tenure: 12, rate: 15, monthlyAmount: 0, totalInterest: 0, totalPayable: 0 },
];
