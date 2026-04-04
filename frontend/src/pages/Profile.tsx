import { Plus, ShieldCheck, Lock } from 'lucide-react';

const MOCK_USER = { name: "Alex Johnson", email: "alex@example.com" };

export function Component() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile & Settings</h1>
      
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center space-x-6">
        <div className="h-20 w-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold">
          AJ
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{MOCK_USER.name}</h2>
          <p className="text-gray-500">{MOCK_USER.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Connected Institutions</h2>
          <button className="text-sm flex items-center space-x-1 text-purple-600 font-medium hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={16} /> <span>Add Bank</span>
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
      </div>

      {/* NEW SECTION: Security & Preferences */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
                <p className="text-sm text-gray-500">Secured via Duo 2FA / Authenticator</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Change Password
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}