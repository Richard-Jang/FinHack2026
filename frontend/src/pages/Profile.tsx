import React, { useEffect, useState, useCallback } from 'react';
import { Plus, ShieldCheck, Lock, Moon, Sun } from 'lucide-react';
import { usePlaidLink } from 'react-plaid-link';
import { motion, type Variants } from 'framer-motion';
import { useAuth } from '../AuthContext';


export function Component() {

  const { user } = useAuth();

  const MOCK_USER = { name: "Hello!", email: user?.email };

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('theme');
      if (val) return val === 'dark';
      return document.documentElement.classList.contains('dark');
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {
      // ignore
    }
  }, [isDark]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  // Plaid Link state
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingOpen, setPendingOpen] = useState(false);

  const onSuccess = useCallback(async (public_token: string, metadata: any) => {
    setConnecting(true);
    setMessage('Connecting bank...');
    try {
      const resp = await fetch('http://localhost:8000/api/exchange_public_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
      });
      const data = await resp.json();
      if (data.error) {
        setMessage('Error connecting bank: ' + data.error);
      } else {
        setMessage('Bank connected successfully');
      }
    } catch (e: any) {
      setMessage('Network error while connecting bank');
    } finally {
      setConnecting(false);
    }
  }, []);

  const { open, ready } = usePlaidLink({ token: linkToken as any, onSuccess });

  useEffect(() => {
    if (pendingOpen && ready) {
      open();
      setPendingOpen(false);
    }
  }, [pendingOpen, ready, open]);

  const handleAddBank = async () => {
    setMessage(null);
    if (!linkToken) {
      setLoadingToken(true);
      try {
        const resp = await fetch('http://localhost:8000/api/create_link_token', { method: 'POST' });
        const data = await resp.json();
        const token = data.link_token || data?.data?.link_token || null;
        setLinkToken(token);
        // request Plaid to open once ready
        setPendingOpen(true);
      } catch (e) {
        setMessage('Failed to get link token');
      } finally {
        setLoadingToken(false);
      }
    } else {
      if (ready) open();
      else setPendingOpen(true);
    }
  };

  return (
    <motion.div className="max-w-3xl mx-auto space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h1 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-6">Profile & Settings</motion.h1>
      
      <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center space-x-6">
        <div className="h-20 w-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold">
          {MOCK_USER.email ? MOCK_USER.email[0].toUpperCase() + MOCK_USER.email[1].toUpperCase() : "AB"}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{MOCK_USER.name}</h2>
          <p className="text-gray-500">{MOCK_USER.email}</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Connected Institutions</h2>
          <button
            onClick={handleAddBank}
            disabled={loadingToken || connecting}
            className="text-sm flex items-center space-x-1 text-purple-600 font-medium hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <Plus size={16} /> <span>{loadingToken ? 'Loading...' : connecting ? 'Connecting...' : 'Add Bank'}</span>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <ShieldCheck size={24} className="text-green-600" />
              <div>
                <p className="font-bold text-gray-900">Chase Bank</p>
                <p className="text-xs text-green-700">Checking •••• 4452</p>
              </div>
            </div>
            <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">Connected</span>
          </div>
          <div className="flex items-center justify-between border border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <ShieldCheck size={24} className="text-green-600" />
              <div>
                <p className="font-bold text-gray-900">American Express</p>
                <p className="text-xs text-green-700">Credit Card •••• 1004</p>
              </div>
            </div>
            <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">Connected</span>
          </div>
        </div>
      </motion.div>

      {/* NEW SECTION: Security & Preferences */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Security & Preferences</h2>
        </div>
        <div className="p-5 space-y-6">
          {/* Authentication Settings */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Lock size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Password & Authentication</p>
                <p className="text-sm text-gray-500">Secured with Multi-Factor Authentication</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </motion.div>
      {/* Animated switch placed at bottom of profile page */}
      <div className="mt-6 flex items-center justify-center">
        <div className="flex items-center space-x-4 bg-white rounded-lg border border-gray-100 shadow-sm px-4 py-3">
          <span className="text-sm text-gray-500">Dark mode</span>
          <button
            role="switch"
            aria-checked={isDark}
            onClick={() => setIsDark(d => !d)}
            className="switch-track"
            aria-label={isDark ? 'Disable dark mode' : 'Enable dark mode'}
          >
            <span className="switch-thumb" style={{ transform: isDark ? 'translateX(20px)' : 'translateX(2px)' }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}