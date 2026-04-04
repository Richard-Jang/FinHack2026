import { useState } from "react";
import { useOutlet, Link, useLocation } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, User, LogOut, Bot, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hi Alex! Based on your spending over the last 30 days, I've analyzed your accounts. You spent $315 on dining out (mostly at Starbucks and DoorDash). You also have a $24.99 gym membership that hasn't been used in 3 months. Cutting back on coffee and canceling the gym could save you ~$150 this month. I also flagged an $89 unknown charge—you might want to review that in your 'Leaks' dashboard."
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
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
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden border border-gray-100 flex flex-col h-[450px] transition-all duration-300 origin-bottom-right">
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
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..." 
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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

export function Component() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className={`transition-colors`}>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800 transition-colors">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen flex flex-col relative z-10 transition-colors">
          <div className="p-6 flex items-center space-x-3 text-purple-600">
            <ShieldCheck size={28} />
            <span className="text-xl font-bold text-gray-900 tracking-tight">WalletWatch</span>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <Link 
              to="/"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/profile"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                location.pathname === '/profile' 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Link 
              to="/sign-out"
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-colors rounded-lg hover:bg-red-50"
            >
              <LogOut size={20} />
              <span>Log out</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto relative pb-24 transition-colors">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global AI Assistant Overlay */}
        <AIAssistant />
        
      </div>
    </div>
  );
}