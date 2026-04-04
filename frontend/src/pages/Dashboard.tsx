import { 
  AlertTriangle, 
  TrendingDown, 
  CreditCard, 
  Wallet, 
  PieChart, 
  Calendar,
  Landmark, 
  ChevronRight,
  Bot,
  TrendingUp
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

export interface Transaction {
  id?: number | string;
  name: string;
  date: string;
  amount: number;       // can be positive or negative
  user_id?: string;
}



export function Component() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const { user } = useAuth();
  
  // Ref lock to prevent React Strict Mode or Auth re-renders from double-firing the LLM API on load.
  const hasFetchedLLM = useRef(false);

  const [chartData, setChartData] = useState<any[]>([]);
  const [chartAdvice, setChartAdvice] = useState<string>("");
  const [isChartLoading, setIsChartLoading] = useState(false);

  // New state for recurring charges
  const [recurringCharges, setRecurringCharges] = useState<any[]>([]);
  const [isRecurringLoading, setIsRecurringLoading] = useState(false);

  const MOCK_RECURRING = [
    { name: 'Planet Fitness', amount: 24.99, nextChargeDate: '2026-04-10', isLeak: true },
    { name: 'Amazon Prime', amount: 14.99, nextChargeDate: '2026-04-15', isLeak: false },
    { name: 'Netflix', amount: 15.49, nextChargeDate: '2026-04-18', isLeak: false },
    { name: 'Spotify Premium', amount: 10.99, nextChargeDate: '2026-05-02', isLeak: false },
    { name: 'Unknown Subscription', amount: 89.00, nextChargeDate: '2026-04-06', isLeak: true }
  ];

  const leaks = useMemo(() => {
    const data = recurringCharges.length > 0 ? recurringCharges : MOCK_RECURRING;
    return data.filter(c => c.isLeak);
  }, [recurringCharges]);

  const subscriptions = useMemo(() => {
    const data = recurringCharges.length > 0 ? recurringCharges : MOCK_RECURRING;
    return data.filter(c => !c.isLeak);
  }, [recurringCharges]);

  const totalLeakAmount = useMemo(() => leaks.reduce((s, c) => s + Number(c.amount), 0), [leaks]);
  const totalSubAmount = useMemo(() => subscriptions.reduce((s, c) => s + Number(c.amount), 0), [subscriptions]);

  const fetchRecurringCharges = useCallback(async (txs: Transaction[]) => {
    if (txs.length === 0) return;
    setIsRecurringLoading(true);
    try {
      const historyData = txs.map(t => ({
        name: t.name,
        date: t.date || new Date().toISOString(),
        amount: Math.abs(t.amount)
      }));
      
      const res = await fetch("http://localhost:8000/api/generate_recurring_charges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: historyData })
      });
      const data = await res.json();
      if (data.chart && Array.isArray(data.chart)) {
        setRecurringCharges(data.chart);
      }
    } catch (e) {
      console.error("Error generating recurring charges:", e);
    } finally {
      setIsRecurringLoading(false);
    }
  }, []);

  const fetchSpendingSummary = useCallback(async (txs: Transaction[]) => {
    if (txs.length === 0) return;
    setIsChartLoading(true);
    try {
      const expenses = txs
        .filter(t => t.amount < 0)
        .map(t => ({ name: t.name, amount: Math.abs(t.amount) }));
      
      const res = await fetch("http://localhost:8000/api/generate_spending_summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: expenses })
      });
      const data = await res.json();
      if (data.chart) {
         setChartData(Array.isArray(data.chart) ? data.chart : [data.chart]);
      }
      if (data.advice) {
         setChartAdvice(data.advice);
      }
    } catch (e) {
      console.error("Error generating spending summary:", e);
    } finally {
      setIsChartLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;
    const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false });
    if (error) console.error("Error fetching transactions:", error);
    if (data) {
      setTransactions(data);
      if (!hasFetchedLLM.current && data.length > 0) {
        hasFetchedLLM.current = true;
        fetchSpendingSummary(data);
        fetchRecurringCharges(data);
      }
    }
  }, [user?.id, fetchSpendingSummary, fetchRecurringCharges]);

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
      // --- JANUARY ---
      { name: "Rent", amount: -1500.00, date: "2024-01-01T08:00:00.000Z", user_id: user.id },
      { name: "Salary", amount: 3000.00, date: "2024-01-01T09:00:00.000Z", user_id: user.id },
      { name: "Starbucks", amount: -6.50, date: "2024-01-03T07:30:00.000Z", user_id: user.id },
      { name: "Planet Fitness Gym", amount: -24.99, date: "2024-01-05T06:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Whole Foods", amount: -142.50, date: "2024-01-08T17:45:00.000Z", user_id: user.id },
      { name: "Uber", amount: -18.20, date: "2024-01-12T19:20:00.000Z", user_id: user.id },
      { name: "Netflix", amount: -15.49, date: "2024-01-15T12:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Xfinity Internet", amount: -79.99, date: "2024-01-20T12:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Target", amount: -84.12, date: "2024-01-22T14:15:00.000Z", user_id: user.id },
      { name: "Amazon", amount: -35.00, date: "2024-01-28T10:00:00.000Z", user_id: user.id },

      // --- FEBRUARY ---
      { name: "Rent", amount: -1500.00, date: "2024-02-01T08:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Salary", amount: 3000.00, date: "2024-02-01T09:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Chipotle", amount: -14.50, date: "2024-02-02T12:30:00.000Z", user_id: user.id },
      { name: "Planet Fitness Gym", amount: -24.99, date: "2024-02-05T06:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Whole Foods", amount: -130.00, date: "2024-02-10T18:10:00.000Z", user_id: user.id },
      { name: "Local Thai Restaurant", amount: -85.00, date: "2024-02-14T20:00:00.000Z", user_id: user.id }, // Date night
      { name: "Netflix", amount: -15.49, date: "2024-02-15T12:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Uber", amount: -22.50, date: "2024-02-18T22:15:00.000Z", user_id: user.id },
      { name: "Xfinity Internet", amount: -79.99, date: "2024-02-20T12:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Target", amount: -45.20, date: "2024-02-25T15:45:00.000Z", user_id: user.id },

      // --- MARCH ---
      { name: "Rent", amount: -1500.00, date: "2024-03-01T08:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Salary", amount: 3000.00, date: "2024-03-01T09:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Starbucks", amount: -7.00, date: "2024-03-04T07:45:00.000Z", user_id: user.id },
      { name: "Planet Fitness Gym", amount: -24.99, date: "2024-03-05T06:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Whole Foods", amount: -155.20, date: "2024-03-09T17:30:00.000Z", user_id: user.id },
      { name: "AMC Theaters", amount: -32.00, date: "2024-03-12T19:00:00.000Z", user_id: user.id },
      { name: "Netflix", amount: -15.49, date: "2024-03-15T12:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Xfinity Internet", amount: -79.99, date: "2024-03-20T12:00:00.000Z", user_id: user.id }, // Recurring
      { name: "Uber", amount: -15.00, date: "2024-03-24T08:30:00.000Z", user_id: user.id },
      
      // --- RECENT DAYS (Dynamic based on current time) ---
      { name: "Shell Gas Station", amount: -42.50, date: new Date(Date.now() - 3 * 86400000).toISOString(), user_id: user.id }, // 3 days ago
      { name: "Spotify Premium", amount: -10.99, date: new Date(Date.now() - 2 * 86400000).toISOString(), user_id: user.id }, // 2 days ago
      { name: "Starbucks", amount: -5.75, date: new Date(Date.now() - 86400000).toISOString(), user_id: user.id } // 1 day ago
    ];
    
    // Attempt insertion without .select() because returning rows requires a SELECT policy
    const { error } = await supabase.from("transactions").insert(mockData);
    if (error) {
      console.error("Error generating data:", error);
      alert("Database error: Ensure the 'transactions' table exists with valid columns. " + error.message);
    } else {
      // Append the mockData manually to UI since we can't fetch it without select privileges
      setTransactions(prev => {
        const newTxs = [...mockData, ...prev];
        fetchSpendingSummary(newTxs);
        fetchRecurringCharges(newTxs);
        return newTxs;
      });
    }
    setLoadingGenerate(false);
  }, [user?.id, fetchSpendingSummary, fetchRecurringCharges]);

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

  // ------------------------------
  // Spending chart + upcoming bills
  // ------------------------------
  // Match transactions to the requested categories using simple keyword rules.
  // Categories: housing, utilities, food, transportation, debt, insurance, medical
  const CATEGORY_DEFS = [
    { id: 'housing', name: 'Housing', keywords: ['rent', 'mortgage', 'landlord', 'apartment', 'lease'], bg: 'bg-fuchsia-500', stroke: '#d946ef' },
    { id: 'utilities', name: 'Utilities', keywords: ['electric', 'electricity', 'water', 'internet', 'gas bill', 'utility', 'utilities'], bg: 'bg-purple-600', stroke: '#9333ea' },
    { id: 'food', name: 'Food', keywords: ['grocery', 'whole foods', 'walmart', 'restaurant', 'dining', 'starbucks', 'ubereats', 'grubhub', 'instacart', 'food'], bg: 'bg-amber-500', stroke: '#f59e0b' },
    { id: 'transportation', name: 'Transportation', keywords: ['uber', 'lyft', 'gas', 'shell', 'chevron', 'mobil', 'bus', 'train', 'taxi', 'metro'], bg: 'bg-pink-400', stroke: '#f472b6' },
    { id: 'debt', name: 'Debt', keywords: ['credit card', 'payment', 'loan', 'student loan', 'mortgage payment', 'creditcard'], bg: 'bg-red-500', stroke: '#ef4444' },
    { id: 'insurance', name: 'Insurance', keywords: ['insurance', 'premium', 'geico', 'progressive', 'state farm'], bg: 'bg-green-500', stroke: '#10b981' },
    { id: 'medical', name: 'Medical', keywords: ['hospital', 'clinic', 'doctor', 'pharmacy', 'cvs', 'walgreens', 'medical'], bg: 'bg-sky-400', stroke: '#38bdf8' },
    { id: 'other', name: 'Other', keywords: [], bg: 'bg-gray-400', stroke: '#9ca3af' },
  ];

  const totalExpenses = useMemo(() => transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0), [transactions]);

  const categories = useMemo(() => {
    const dataToProcess = chartData.length > 0 ? chartData : [
      { label: 'Housing', percentage: 35 },
      { label: 'Food', percentage: 25 },
      { label: 'Transportation', percentage: 20 },
      { label: 'Utilities', percentage: 10 },
      { label: 'Other', percentage: 10 }
    ];

    return dataToProcess.map(c => {
      const label = c.label || c.name || 'Other';
      const percentage = c.percentage || 0;
      
      let matchedColors = null;
      for (const def of CATEGORY_DEFS) {
        if (def.name.toLowerCase() === label.toLowerCase()) {
           matchedColors = { bg: def.bg, stroke: def.stroke };
           break;
        }
      }
      if (!matchedColors) matchedColors = { bg: 'bg-gray-400', stroke: '#9ca3af' };

      const amount = totalExpenses * (percentage / 100);
      return {
        id: label,
        name: label,
        amount,
        percentage,
        bg: matchedColors.bg,
        stroke: matchedColors.stroke
      };
    }).sort((a,b) => b.percentage - a.percentage);
  }, [chartData, totalExpenses]);



  const SpendingBreakdownChart = ({ categoriesProp, totalProp }: { categoriesProp: any[]; totalProp: number }) => {
    let cumulativePercent = 0;
    const cats = categoriesProp;
    const total = totalProp;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden p-5 flex flex-col h-full relative min-h-[400px]">
        {isChartLoading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm">
             <div className="flex flex-col items-center space-y-4">
               <motion.div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
               <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Analyzing transactions...</span>
             </div>
          </div>
        )}
        <div className="flex items-center space-x-2 mb-6">
          <PieChart size={20} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Spending Breakdown</h2>
        </div>
        
        {chartAdvice && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 flex items-start space-x-3"
          >
            <Bot size={20} className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-purple-100 dark:text-purple-900">
              {chartAdvice}
            </p>
          </motion.div>
        )}

        {cats.length === 0 && !isChartLoading && (
           <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
             No spending data available.
           </div>
        )}

        {cats.length > 0 && (
        <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-8 md:px-4">
          <div className="relative w-grow h-56 md:w-64 md:h-64 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 filter drop-shadow-sm">
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-gray-100 dark:text-gray-700"></circle>
              {cats.map((cat, i) => {
                const offset = -cumulativePercent;
                cumulativePercent += cat.percentage;
                if (total < 5) return null;
                return (
                  <motion.circle
                    key={cat.id}
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke={cat.stroke}
                    strokeWidth="4"
                    strokeDasharray={`${cat.percentage} ${100 - cat.percentage}`}
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, delay: i * 0.1, type: "spring", bounce: 0.1 }}
                    className="cursor-pointer hover:stroke-[5px]"
                  ></motion.circle>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Spent</span>
            </div>
          </div>

          <div className="flex-1 space-y-3 w-full">
            {cats.map((cat, i) => (
              <motion.div 
                key={cat.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <div className={`${cat.bg} w-3 h-3 rounded-full shadow-sm`}></div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900 dark:text-white block">${cat.amount.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{cat.percentage}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        )}
      </div>
    );
  };

  const UpcomingBillsTimeline = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
          <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Bills</h2>
        </div>
        <div className="p-5 relative">
          <div className="absolute left-[33px] top-8 bottom-8 w-0.5 bg-gray-100 dark:bg-gray-700"></div>

          <div className="space-y-6 relative">
            {subscriptions.map((bill, idx) => {
              const daysAway = bill.nextChargeDate ? Math.ceil((new Date(bill.nextChargeDate).getTime() - Date.now()) / (1000 * 3600 * 24)) : 0;
              return (
              <div key={idx} className="flex items-start">
                <div className="flex flex-col items-center mr-4 relative z-10">
                  <div className={`h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 ${
                    daysAway <= 3 ? 'bg-red-500' : 'bg-purple-500'
                  }`}></div>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50 mt-[-10px] hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">{bill.name}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${Number(bill.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Due: {bill.nextChargeDate || 'Unknown'}</span>
                    <span className={`font-medium ${
                      daysAway <= 3 ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      In {daysAway && !isNaN(daysAway) ? daysAway : '?'} days
                    </span>
                  </div>
                </div>
              </div>
            )})}
            {subscriptions.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-4">
                {isRecurringLoading ? 'Loading bills...' : 'No upcoming bills detected.'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // AI Insight widget (interactive)
  const AIInsightWidget = () => {
    const [insight, setInsight] = useState<React.ReactNode>("Click the button below to generate a real-time AI analysis of your recurring charges.");
    const [loadingInsight, setLoadingInsight] = useState(false);

    const generateContent = async () => {
      setLoadingInsight(true);
      try {
        const historyData = transactions.map(t => ({
          name: t.name,
          date: t.date || new Date().toISOString(),
          amount: t.amount
        }));

        const resp = await fetch('http://localhost:8000/api/generate_recurring_charges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history: historyData }),
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.chart && Array.isArray(data.chart)) {
            if (data.chart.length === 0) {
              setInsight("No recurring charges or leaks were detected in your recent history.");
            } else {
              setInsight(
                <div className="space-y-2">
                  <p className="font-semibold text-purple-900 dark:text-purple-900 border-b border-purple-100 dark:border-purple-800 pb-1">AI Detected Charges:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {data.chart.map((c: any, i: number) => (
                      <div key={i} className={`p-2 rounded-md text-xs border ${c.isLeak ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-800/50 text-purple-800 dark:text-purple-200'}`}>
                        <div className="flex justify-between font-bold">
                          <span>{c.name}</span>
                          <span>${Number(c.amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] uppercase tracking-wider opacity-70">
                          <span>{c.nextChargeDate || 'Unknown'}</span>
                          {c.isLeak ? <span className="text-red-600 dark:text-red-400 font-bold">Leak!</span> : <span>Sub</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          } else {
            setInsight("Failed to parse the AI report.");
          }
        } else {
           setInsight("Failed to connect to the backend server.");
        }
      } catch (err) {
        setInsight("An error occurred. Check your network.");
        console.error(err);
      } finally {
        setLoadingInsight(false);
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bot size={20} className="text-purple-600" />
            <h3 className="font-bold text-purple-900 dark:text-purple-900">AI Insight</h3>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Realtime · Private</div>
        </div>

        <div className="min-h-[68px] text-sm text-gray-900 dark:text-gray-900 leading-relaxed">
          {insight}
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <button
            onClick={() => generateContent()}
            disabled={loadingInsight}
            className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 disabled:opacity-50"
          >
            {loadingInsight ? 'Analyzing...' : 'Scan Transactions'}
          </button>
        </div>
      </div>
    );
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
          <span className="text-3xl font-bold text-gray-900">${totalSubAmount.toFixed(2)}</span>
          <span className="text-xs text-gray-500 font-medium mt-2">Across {subscriptions.length} services</span>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-red-600 text-sm font-bold">Identified Leaks</h3>
            <div className="bg-red-100 p-2 rounded-lg"><AlertTriangle size={18} className="text-red-600" /></div>
          </div>
          <span className="text-3xl font-bold text-red-700">${totalLeakAmount.toFixed(2)}</span>
          <span className="text-xs text-red-600 font-medium mt-2">{leaks.length} actions required</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Money Leaks Section */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <AlertTriangle size={20} className="text-red-500" />
                  <span>Money Leaks Detected</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We found recurring charges that look suspicious or unused.</p>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {leaks.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  {isRecurringLoading ? 'Analyzing...' : 'No leaks found in this period.'}
                </div>
              ) : leaks.map((leak, idx) => (
                <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex flex-col mb-3 sm:mb-0">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{leak.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">AI Flagged • Last mapped {leak.nextChargeDate || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between sm:w-auto w-full space-x-4">
                    <span className="font-bold text-gray-900 dark:text-gray-100">${Number(leak.amount).toFixed(2)}</span>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                      Review / Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Spending breakdown - moved into left column for more space */}
          <motion.div variants={itemVariants} className="">
            <SpendingBreakdownChart categoriesProp={categories} totalProp={totalExpenses} />
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
            <motion.div variants={itemVariants}>
              <UpcomingBillsTimeline />
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Verified Subscriptions</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {subscriptions.map((sub, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{sub.name}</p>
                    <p className="text-xs text-gray-500">Next: {sub.nextChargeDate || 'Unknown'}</p>
                  </div>
                  <span className="font-semibold text-gray-900">${Number(sub.amount).toFixed(2)}</span>
                </div>
              ))}
              {subscriptions.length === 0 && (
                 <div className="p-4 text-center text-sm text-gray-500">
                    No subscriptions found.
                 </div>
              )}
            </div>
             <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                <button className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center justify-center w-full">
                  Manage Subscriptions <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
          </motion.div>

          {/* Quick AI Advice Widget */}
          <motion.div variants={itemVariants}>
            <AIInsightWidget />
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}