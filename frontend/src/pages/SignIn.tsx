import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

export function Component() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setError(authError.message);
    } else if (authData) {
      navigate('/');
    }
    setLoading(false);
  };

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" {...register("email")} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all" />
              <p className="text-red-500 text-xs mt-1 h-4">{errors.email?.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" {...register("password")} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all" />
              <div className="flex justify-between items-center mt-1">
                <p className="text-red-500 text-xs h-4">{errors.password?.message}</p>
                <Link to="/forgot" className="text-xs font-medium text-purple-600 hover:text-purple-500">Forgot Password?</Link>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
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