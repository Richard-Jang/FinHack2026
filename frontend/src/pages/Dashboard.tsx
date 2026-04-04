import { 
  AlertTriangle, 
  TrendingDown, 
  CreditCard, 
  Wallet, 
  PieChart, 
  Landmark, 
  ChevronRight,
  Bot,
  TrendingUp
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

export interface Transaction {
  id?: number | string;
  name: string;
  date: string;
  amount: number;       // can be positive or negative
  user_id?: string;
}

const MOCK_LEAKS = [
  { id: 1, name: "Planet Fitness", amount: 24.99, type: "Unused Subscription", risk: "Low", date: "Apr 1, 2026", url: "https://www.planetfitness.com" },
  { id: 2, name: "Amazon", amount: 89.00, type: "Potential Scam", risk: "High", date: "Mar 28, 2026", url: "https://www.amazon.com" },
];

const MOCK_SUBSCRIPTIONS = [
  { id: 1, name: "Netflix", amount: 15.49, status: "Active", nextBilling: "Apr 15, 2026" },
  { id: 2, name: "Spotify Premium", amount: 10.99, status: "Active", nextBilling: "Apr 18, 2026" },
  { id: 3, name: "Amazon Prime", amount: 14.99, status: "Active", nextBilling: "May 2, 2026" },
];

export function Component() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const { user } = useAuth();

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;
    const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false });
    if (error) console.error("Error fetching transactions:", error);
    if (data) setTransactions(data);
  }, [user?.id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleGenerate = useCallback(async () => {
    if (!user?.id) {
        alert("Authentication context not fully loaded. Please wait or sign in again.");
        return;
    }
    
    setLoadingGenerate(true);
    const mockData: Transaction[] = [
      { name: "Whole Foods", amount: -142.50, date: new Date().toISOString(), user_id: user.id },
      { name: "Uber", amount: -18.20, date: new Date().toISOString(), user_id: user.id },
      { name: "Starbucks", amount: -6.50, date: new Date().toISOString(), user_id: user.id },
      { name: "Target", amount: -84.12, date: new Date().toISOString(), user_id: user.id },
      { name: "Salary", amount: 3000.00, date: new Date().toISOString(), user_id: user.id },
      { name: "Rent", amount: -1500.00, date: new Date(Date.now() - 86400000).toISOString(), user_id: user.id }
    ];
    
    // Attempt insertion without .select() because returning rows requires a SELECT policy
    const { error } = await supabase.from("transactions").insert(mockData);
    if (error) {
      console.error("Error generating data:", error);
      alert("Database error: Ensure the 'transactions' table exists with valid columns. " + error.message);
    } else {
      // Append the mockData manually to UI since we can't fetch it without select privileges
      setTransactions(prev => [...mockData, ...prev]);
    }
    setLoadingGenerate(false);
  }, [user?.id]);

  const monthlyOutflow = useMemo(() => {
    return transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [transactions]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Here's what's happening with your money this month.</p>
        </div>
        <div className="hidden md:flex items-center space-x-3">
          <button onClick={handleGenerate} disabled={loadingGenerate} className="flex items-center space-x-2 bg-purple-50 border border-purple-200 px-4 py-2 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors shadow-sm disabled:opacity-50">
            {loadingGenerate ? 'Generating...' : 'Generate Data'}
          </button>
          <button className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Landmark size={16} className="text-gray-500" />
            <span>Sync Banks</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Monthly Outflow</h3>
            <div className="bg-fuchsia-50 p-2 rounded-lg"><TrendingDown size={18} className="text-fuchsia-600" /></div>
          </div>
          <span className="text-3xl font-bold text-gray-900">${monthlyOutflow.toFixed(2)}</span>
          <span className="text-xs text-green-600 font-medium mt-2">Based on your activity</span>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Active Subscriptions</h3>
            <div className="bg-purple-50 p-2 rounded-lg"><CreditCard size={18} className="text-purple-600" /></div>
          </div>
          <span className="text-3xl font-bold text-gray-900">$142.00</span>
          <span className="text-xs text-gray-500 font-medium mt-2">Across 8 services</span>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-red-600 text-sm font-bold">Identified Leaks</h3>
            <div className="bg-red-100 p-2 rounded-lg"><AlertTriangle size={18} className="text-red-600" /></div>
          </div>
          <span className="text-3xl font-bold text-red-700">$113.99</span>
          <span className="text-xs text-red-600 font-medium mt-2">2 actions required</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Money Leaks Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <AlertTriangle size={20} className="text-red-500" />
                  <span>Money Leaks Detected</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">We found recurring charges that look suspicious or unused.</p>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {MOCK_LEAKS.map(leak => (
                <div key={leak.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col mb-3 sm:mb-0">
                    <span className="font-semibold text-gray-900">{leak.name}</span>
                    <span className="text-sm text-gray-500">{leak.type} • Last billed {leak.date}</span>
                  </div>
                  <div className="flex items-center justify-between sm:w-auto w-full space-x-4">
                    <span className="font-bold text-gray-900">${leak.amount}</span>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                      Review / Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
              <button className="text-purple-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-50">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500 bg-gray-50">
                  No transactions available.
                  <br />
                  <span className="text-xs text-gray-400">Click &apos;Generate Data&apos; to add some.</span>
                </div>
              ) : transactions.slice(0, 8).map((tx, i) => (
                <div key={tx.id || i} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {tx.amount > 0 ? <TrendingUp size={18}/> : (tx.amount < -100 ? <PieChart size={18}/> : <Wallet size={18}/>)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tx.name}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Subscriptions */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Verified Subscriptions</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_SUBSCRIPTIONS.map(sub => (
                <div key={sub.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{sub.name}</p>
                    <p className="text-xs text-gray-500">Next: {sub.nextBilling}</p>
                  </div>
                  <span className="font-semibold text-gray-900">${sub.amount}</span>
                </div>
              ))}
            </div>
             <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                <button className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center justify-center w-full">
                  Manage Subscriptions <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
          </motion.div>

          {/* Quick AI Advice Widget */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-xl border border-purple-100 p-5 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <Bot size={20} className="text-purple-600" />
              <h3 className="font-bold text-purple-900">AI Weekly Insight</h3>
            </div>
            <p className="text-sm text-purple-800 leading-relaxed">
              You are on track to spend <strong>15% less</strong> on online shopping this month! Keep it up. However, your dining out budget is getting tight.
            </p>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}