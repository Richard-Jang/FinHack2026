import { Link, useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  verifyCode: yup.string().length(6, "Code must be exactly 6 digits").matches(/^\d+$/, "Code must be numbers only").required("Code is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

export function Component() {
    const navigate = useNavigate();
    const [factorId, setFactorId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.1, duration: 0.4 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    useEffect(() => {
        let isMounted = true;
        const fetchFactors = async () => {
            const { data, error } = await supabase.auth.mfa.listFactors();
            if (error) {
                if (isMounted) setError(error.message);
            } else if (data?.totp && data.totp.length > 0 && isMounted) {
                const verifiedFactor = data.totp.find(f => f.status === 'verified');
                if (verifiedFactor) {
                    setFactorId(verifiedFactor.id);
                } else {
                    setError("No verified MFA factor found.");
                }
            } else if (isMounted) {
                navigate("/set-mfa"); // Redirect if they don't have it somehow
            }
            if (isMounted) setFetching(false);
        };
        fetchFactors();
        return () => { isMounted = false; };
    }, [navigate]);

    const onSubmit = async (data: FormData) => {
        if (!factorId) return;

        setLoading(true);
        setError(null);

        try {
            const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
            if (challengeError) throw challengeError;

            const { error: verifyError } = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challengeData.id,
                code: data.verifyCode
            });

            if (verifyError) throw verifyError;

            // Success, navigate to dashboard
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div className="sm:mx-auto sm:w-full sm:max-w-md" variants={containerVariants} initial="hidden" animate="visible">
                <div className="bg-white shadow-lg sm:rounded-2xl overflow-hidden flex flex-col items-center">
                    <div className="bg-purple-600 w-full py-10 flex flex-col items-center text-white">
                        <motion.h2 className="text-3xl font-bold tracking-tight mb-2">Two-Factor Auth</motion.h2>
                        <p className="text-purple-100 text-sm px-4 text-center">Enter the 6-digit code from your authenticator app.</p>
                    </div>

                    <div className="w-full px-6 py-8 sm:px-10">
                        {error && (
                            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {fetching ? (
                            <div className="flex justify-center p-8 text-purple-600">Loading...</div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="verifyCode" className="block text-sm font-medium text-gray-700 text-center">Verification Code</label>
                                    <div className="mt-2 relative">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            {...register("verifyCode")}
                                            autoFocus
                                            className="appearance-none block w-full px-4 py-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-2xl text-center tracking-[0.5em] transition-colors font-mono font-bold text-gray-800"
                                            placeholder="••••••"
                                        />
                                        <p className="text-red-500 text-xs mt-2 text-center h-4">{errors.verifyCode?.message}</p>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="pt-2">
                                    <motion.button type="submit" disabled={loading} className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:shadow-none">
                                        {loading ? 'Verifying...' : 'Verify Login'}
                                    </motion.button>
                                </motion.div>
                            </form>
                        )}
                        <div className="mt-8 text-center">
                            <Link to="/sign-in" onClick={() => supabase.auth.signOut()} className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors">
                                Use a different account
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
