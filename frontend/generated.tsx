import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  Bot, 
  CreditCard, 
  AlertTriangle, 
  TrendingDown, 
  ShieldCheck, 
  X, 
  Send,
  ChevronRight,
  Wallet,
  PieChart,
  Landmark,
  Plus,
  Lock,
  Moon,
  Sun
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_USER = { name: "Alex Johnson", email: "alex@example.com" };

const MOCK_LEAKS = [
  { id: 1, name: "Planet Fitness", amount: 24.99, type: "Unused Subscription", risk: "Low", date: "Apr 1, 2026" },
  { id: 2, name: "UNKNOWN*WEB-SVC", amount: 89.00, type: "Potential Scam", risk: "High", date: "Mar 28, 2026" },
];

const MOCK_SUBSCRIPTIONS = [
  { id: 1, name: "Netflix", amount: 15.49, status: "Active", nextBilling: "Apr 15, 2026" },
  { id: 2, name: "Spotify Premium", amount: 10.99, status: "Active", nextBilling: "Apr 18, 2026" },
  { id: 3, name: "Amazon Prime", amount: 14.99, status: "Active", nextBilling: "May 2, 2026" },
];

const MOCK_TRANSACTIONS = [
  { id: 1, merchant: "Whole Foods", amount: 142.50, category: "Groceries", date: "Apr 2, 2026" },
  { id: 2, merchant: "Uber", amount: 18.20, category: "Transport", date: "Apr 1, 2026" },
  { id: 3, merchant: "Starbucks", amount: 6.50, category: "Dining", date: "Apr 1, 2026" },
  { id: 4, merchant: "Target", amount: 84.12, category: "Shopping", date: "Mar 30, 2026" },
];

// --- COMPONENTS ---

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hi Alex! Based on your spending over the last 30 days, I've analyzed your accounts. You spent $315 on dining out (mostly at Starbucks and DoorDash). You also have a $24.99 gym membership that hasn't been used in 3 months. Cutting back on coffee and canceling the gym could save you ~$150 this month. I also flagged an $89 unknown charge—you might want to review that in your 'Leaks' dashboard."
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: "I've noted that! Do you want me to start the cancellation process for your gym membership?" 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-[450px] transition-all duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-fuchsia-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <span className="font-semibold">FinAI Advisor</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center space-x-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..." 
              className="flex-1 bg-gray-100 dark:bg-gray-900 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button type="submit" className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50" disabled={!input.trim()}>
              <Send size={16} className="ml-0.5" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-purple-600 to-fuchsia-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center float-right"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Here's what's happening with your money this month.</p>
        </div>
        <button className="hidden md:flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
          <Landmark size={16} className="text-gray-500 dark:text-gray-400" />
          <span>Sync Banks</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Monthly Outflow</h3>
            <div className="bg-fuchsia-50 dark:bg-fuchsia-900/30 p-2 rounded-lg"><TrendingDown size={18} className="text-fuchsia-600 dark:text-fuchsia-400" /></div>
          </div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">$2,450.80</span>
          <span className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">-12% vs last month</span>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Subscriptions</h3>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg"><CreditCard size={18} className="text-purple-600 dark:text-purple-400" /></div>
          </div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">$142.00</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">Across 8 services</span>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-900/50 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-red-600 dark:text-red-400 text-sm font-bold">Identified Leaks</h3>
            <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-lg"><AlertTriangle size={18} className="text-red-600 dark:text-red-400" /></div>
          </div>
          <span className="text-3xl font-bold text-red-700 dark:text-red-400">$113.99</span>
          <span className="text-xs text-red-600 dark:text-red-400 font-medium mt-2">2 actions required</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Money Leaks Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm overflow-hidden relative">
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
              {MOCK_LEAKS.map(leak => (
                <div key={leak.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex flex-col mb-3 sm:mb-0">
                    <span className="font-semibold text-gray-900 dark:text-white">{leak.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{leak.type} • Last billed {leak.date}</span>
                  </div>
                  <div className="flex items-center justify-between sm:w-auto w-full space-x-4">
                    <span className="font-bold text-gray-900 dark:text-white">${leak.amount}</span>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors">
                      Review / Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
              <button className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {MOCK_TRANSACTIONS.map(tx => (
                <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {tx.category === 'Groceries' ? <PieChart size={18}/> : <Wallet size={18}/>}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{tx.merchant}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">-${tx.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Subscriptions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
             <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Verified Subscriptions</h2>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {MOCK_SUBSCRIPTIONS.map(sub => (
                <div key={sub.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{sub.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Next: {sub.nextBilling}</p>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">${sub.amount}</span>
                </div>
              ))}
            </div>
             <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-center">
                <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center justify-center w-full">
                  Manage Subscriptions <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
          </div>

          {/* Quick AI Advice Widget */}
          <div className="bg-gradient-to-br from-fuchsia-50 dark:from-fuchsia-900/20 to-purple-50 dark:to-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50 p-5 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <Bot size={20} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-purple-900 dark:text-purple-100">AI Weekly Insight</h3>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
              You are on track to spend <strong>15% less</strong> on online shopping this month! Keep it up. However, your dining out budget is getting tight.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

const Profile = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile & Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex items-center space-x-6">
        <div className="h-20 w-20 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl font-bold">
          AJ
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{MOCK_USER.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{MOCK_USER.email}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Connected Institutions</h2>
          <button className="text-sm flex items-center space-x-1 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={16} /> <span>Add Bank</span>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <ShieldCheck size={24} className="text-green-600 dark:text-green-400" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Chase Bank</p>
                <p className="text-xs text-green-700 dark:text-green-500">Checking •••• 4452</p>
              </div>
            </div>
            <span className="text-sm font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-full">Connected</span>
          </div>
          <div className="flex items-center justify-between border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <ShieldCheck size={24} className="text-green-600 dark:text-green-400" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">American Express</p>
                <p className="text-xs text-green-700 dark:text-green-500">Credit Card •••• 1004</p>
              </div>
            </div>
            <span className="text-sm font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-full">Connected</span>
          </div>
        </div>
      </div>

      {/* NEW SECTION: Security & Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Security & Preferences</h2>
        </div>
        <div className="p-5 space-y-6">
          {/* Authentication Settings */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <Lock size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Password & Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Secured via Duo 2FA / Authenticator</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              Change Password
            </button>
          </div>
          
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {isDarkMode ? <Moon size={20} className="text-purple-400" /> : <Sun size={20} className="text-purple-600" />}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Appearance</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle light or dark theme</p>
              </div>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isDarkMode ? 'bg-purple-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Login = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold">WalletWatch</h2>
          <p className="text-purple-100 mt-2 text-sm">Track your leaks. Grow your wealth.</p>
        </div>
        <div className="p-8 space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" defaultValue="alex@example.com" className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input type="password" defaultValue="password123" className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all" />
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700 transition-colors">
              Sign In to Dashboard
            </button>
          </form>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account? <a href="#" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'dashboard', 'profile'
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (currentPage === 'login') {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
         <Login onLogin={() => setCurrentPage('dashboard')} />
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''} transition-colors`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row font-sans text-gray-800 dark:text-gray-100 transition-colors">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 md:min-h-screen flex flex-col relative z-10 transition-colors">
          <div className="p-6 flex items-center space-x-3 text-purple-600 dark:text-purple-400">
            <ShieldCheck size={28} />
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">WalletWatch</span>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                currentPage === 'dashboard' 
                  ? 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => setCurrentPage('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                currentPage === 'profile' 
                  ? 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setCurrentPage('login')}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-gray-700"
            >
              <LogOut size={20} />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto relative pb-24 transition-colors">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'profile' && <Profile isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />}
        </main>

        {/* Global AI Assistant Overlay */}
        <AIAssistant />
        
      </div>
    </div>
  );
}