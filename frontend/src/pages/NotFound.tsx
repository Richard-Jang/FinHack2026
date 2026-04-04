import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Component() {
    return (
        <div className="min-h-full flex flex-col justify-center py-24 sm:px-6 lg:px-8 bg-white">
            <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
                <motion.p 
                    className="text-base font-semibold text-purple-600"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    404
                </motion.p>
                <motion.h1 
                    className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Page not found
                </motion.h1>
                <motion.p 
                    className="mt-4 text-base text-gray-500"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Sorry, we couldn't find the page you're looking for.
                </motion.p>
                
                <motion.div 
                    className="mt-6 flex justify-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                        >
                            Go back home
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-4 py-2 border border-purple-200 text-sm font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                        >
                            Contact support
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}