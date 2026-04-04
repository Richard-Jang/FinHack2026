import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
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

        const { error } = await supabase.auth.updateUser({
            password: data.password
        });

        if (error) {
            setError(error.message);
        } else {
            // Success, navigate to dashboard
            navigate('/');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div 
                className="sm:mx-auto sm:w-full sm:max-w-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h2 className="mt-6 text-center text-3xl font-extrabold text-purple-900">
                    Set new password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Please enter your new password below.
                </p>
            </motion.div>

            <motion.div 
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-purple-600" />

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    {...register("password")}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-shadow"
                                />
                                <p className="text-red-500 text-xs mt-1 h-4">{errors.password?.message}</p>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update password'}
                            </motion.button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
