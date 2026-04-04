import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

export function Component() {
    const cardVariants: Variants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { 
            scale: 1, 
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    return (
        <div className="min-h-full flex flex-col justify-center py-24 sm:px-6 lg:px-8">
            <motion.div 
                className="sm:mx-auto sm:w-full sm:max-w-md bg-white shadow sm:rounded-lg border border-purple-100 py-10 px-4 text-center relative overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-purple-600" />

                <motion.div 
                    className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    <svg className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>

                <motion.h2 
                    className="mt-6 text-3xl font-extrabold text-gray-900"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    You've been signed out
                </motion.h2>

                <motion.p 
                    className="mt-4 text-gray-600 text-sm"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Thank you for using FinHack. You have successfully logged out of your account.
                </motion.p>

                <motion.div 
                    className="mt-8 relative z-10"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link
                        to="/sign-in"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    >
                        Sign in again
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}