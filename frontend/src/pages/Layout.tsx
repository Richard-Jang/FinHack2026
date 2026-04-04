import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export function Component() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="bg-purple-700 text-white shadow-md relative z-10"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <motion.div 
                            className="flex-shrink-0 flex items-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link to="/" className="text-2xl font-bold tracking-tight">FinHack</Link>
                        </motion.div>
                        <nav className="hidden md:flex space-x-8">
                            <Link 
                                to="/" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-600 hover:text-white'}`}
                            >
                                Dashboard
                            </Link>
                            <Link 
                                to="/profile" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/profile' ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-600 hover:text-white'}`}
                            >
                                Profile
                            </Link>
                            <Link 
                                to="/sign-in" 
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/sign-in' ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-600 hover:text-white'}`}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/sign-out" 
                                className="px-3 py-2 rounded-md text-sm font-medium text-purple-100 hover:bg-purple-800 transition-colors bg-purple-900/50"
                            >
                                Sign Out
                            </Link>
                        </nav>
                    </div>
                </div>
            </motion.header>

            <motion.main 
                key={location.pathname}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                <Outlet />
            </motion.main>

            <motion.footer 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-purple-50 border-t border-purple-100 text-center py-6 text-purple-600 text-sm mt-auto"
            >
                <p>&copy; 2026 FinHack. All rights reserved.</p>
            </motion.footer>
        </div>
    );
}