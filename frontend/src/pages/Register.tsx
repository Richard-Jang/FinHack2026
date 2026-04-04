import { Link, useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

export function Component() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { when: "beforeChildren", staggerChildren: 0.1, duration: 0.4 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.name,
                }
            }
        });

        if (authError) {
            setError(authError.message);
        } else if (authData) {
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div 
                className="sm:mx-auto sm:w-full sm:max-w-md"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="bg-white shadow-lg sm:rounded-2xl overflow-hidden flex flex-col items-center">
                    <div className="bg-purple-600 w-full py-10 flex flex-col items-center text-white">
                        <motion.div 
                            className="h-12 w-12 rounded-full border-2 border-white/30 flex items-center justify-center mb-4 bg-purple-500/50"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                            </svg>
                        </motion.div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">WalletWatch</h2>
                        <p className="text-purple-100 text-sm">Join to track your leaks and grow your wealth.</p>
                    </div>

                    <div className="w-full px-6 py-8 sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            {error && (
                                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        placeholder="Alex Mercer"
                                        {...register("name")}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors"
                                    />
                                    <p className="text-red-500 text-xs mt-1 h-3">{errors.name?.message}</p>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        placeholder="alex@example.com"
                                        {...register("email")}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors"
                                    />
                                    <p className="text-red-500 text-xs mt-1 h-3">{errors.email?.message}</p>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        placeholder="••••••••••"
                                        {...register("password")}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors"
                                    />
                                    <p className="text-red-500 text-xs mt-1 h-3">{errors.password?.message}</p>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </motion.button>
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="mt-6 text-center">
                                <span className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/sign-in" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
                                        Sign in
                                    </Link>
                                </span>
                            </motion.div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
