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
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [enrolling, setEnrolling] = useState(true);

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
        const enrollMFA = async () => {
            const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
            if (error) {
                if (isMounted) {
                    setError(error.message);
                    setEnrolling(false);
                }
            } else if (data && isMounted) {
                setFactorId(data.id);
                setQrCode(data.totp.qr_code);
                setSecret(data.totp.secret);
                setEnrolling(false);
            }
        };
        enrollMFA();
        return () => { isMounted = false; };
    }, []);

    const onSubmit = async (data: FormData) => {
        if (!factorId) return;

        setLoading(true);
        setError(null);

        try {
            // First we need to generate a challenge
            const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
            if (challengeError) throw challengeError;

            // Then verify the code against the challenge
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
                        <motion.h2 className="text-3xl font-bold tracking-tight mb-2">Setup 2FA</motion.h2>
                        <p className="text-purple-100 text-sm px-4 text-center">Scan the QR code with your authenticator app to protect your WalletWatch account.</p>
                    </div>

                    <div className="w-full px-6 py-8 sm:px-10">
                        {error && (
                            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {enrolling && !error ? (
                            <div className="flex justify-center p-8 text-purple-600">Generating QR Code...</div>
                        ) : qrCode && (
                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                <motion.div variants={itemVariants} className="flex flex-col items-center">
                                    <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm mb-4" dangerouslySetInnerHTML={{ __html: qrCode }} />
                                    <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">{secret}</p>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label htmlFor="verifyCode" className="block text-sm font-medium text-gray-700">Enter Verification Code</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            {...register("verifyCode")}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-lg text-center tracking-widest transition-colors font-mono"
                                            placeholder="123456"
                                        />
                                        <p className="text-red-500 text-xs mt-1 h-4">{errors.verifyCode?.message}</p>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <motion.button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50">
                                        {loading ? 'Verifying...' : 'Complete Setup'}
                                    </motion.button>
                                </motion.div>
                            </form>
                        )}
                        <div className="mt-6 text-center">
                            <span className="text-sm text-gray-600">
                                <Link to="/sign-in" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
                                    Skip for now (not recommended)
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
