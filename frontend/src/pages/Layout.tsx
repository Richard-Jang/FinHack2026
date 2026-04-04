import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";

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

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="bg-purple-700 text-white shadow-md relative z-10"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <motion.div 
                            className="flex-shrink-0 flex items-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link to="/" className="text-2xl font-bold tracking-tight">FinHack</Link>
                        </motion.div>
                        <nav className="hidden md:flex space-x-8">
                            <Link 
                                to="/" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-600 hover:text-white'}`}
                            >
                                Dashboard
                            </Link>
                            <Link 
                                to="/profile" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/profile' ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-600 hover:text-white'}`}
                            >
                                Profile
                            </Link>
                            <Link 
                                to="/sign-in" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/sign-in' ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-600 hover:text-white'}`}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/sign-out" 
                                className="px-3 py-2 rounded-md text-sm font-medium text-purple-100 hover:bg-purple-800 transition-colors bg-purple-900/50"
                            >
                                Sign Out
                            </Link>
                        </nav>
                    </div>
                </div>
            </motion.header>

            <motion.main 
                key={location.pathname}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                <Outlet />
            </motion.main>

            <motion.footer 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-purple-50 border-t border-purple-100 text-center py-6 text-purple-600 text-sm mt-auto"
            >
                <p>&copy; 2026 FinHack. All rights reserved.</p>
            </motion.footer>

            <AIAssistant />
        </div>
    );
}