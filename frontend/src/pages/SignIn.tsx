import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export function Component() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 transition-colors">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 text-center bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold">WalletWatch</h2>
          <p className="text-purple-100 mt-2 text-sm">Track your leaks. Grow your wealth.</p>
        </div>
        <div className="p-8 space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); navigate('/'); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" defaultValue="alex@example.com" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" defaultValue="password123" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all" />
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700 transition-colors">
              Sign In to Dashboard
            </button>
          </form>
          <div className="text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-purple-600 font-medium hover:underline">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}