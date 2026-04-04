import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

export function Component() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    const listVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <motion.div 
            className="py-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="px-4 sm:px-6 lg:px-8">
                <motion.h1 className="text-3xl font-bold text-gray-900" variants={cardVariants}>Dashboard</motion.h1>
                <motion.p className="mt-2 text-sm text-gray-600" variants={cardVariants}>Welcome back! Here's what's happening with your accounts today.</motion.p>
            </div>
            
            <div className="mt-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1 */}
                    <motion.div variants={cardVariants} whileHover={{ y: -5 }} className="bg-white overflow-hidden shadow rounded-lg border border-purple-100 hover:border-purple-300 transition-colors">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                            <dd className="mt-1 text-3xl font-semibold text-purple-700">$24,500.00</dd>
                        </div>
                        <div className="bg-purple-50 px-4 py-4 sm:px-6">
                            <div className="text-sm">
                                <Link to="#" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">View details &rarr;</Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div variants={cardVariants} whileHover={{ y: -5 }} className="bg-white overflow-hidden shadow rounded-lg border border-purple-100 hover:border-purple-300 transition-colors">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Recent Transactions</dt>
                            <dd className="mt-1 text-3xl font-semibold text-purple-700">12</dd>
                        </div>
                        <div className="bg-purple-50 px-4 py-4 sm:px-6">
                            <div className="text-sm">
                                <Link to="#" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">View all activity &rarr;</Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div variants={cardVariants} whileHover={{ y: -5 }} className="bg-white overflow-hidden shadow rounded-lg border border-purple-100 hover:border-purple-300 transition-colors">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Savings Goal</dt>
                            <dd className="mt-1 text-3xl font-semibold text-purple-700">65%</dd>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 overflow-hidden relative">
                                <motion.div 
                                    className="bg-purple-600 h-2.5 rounded-full absolute top-0 left-0" 
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                        <div className="bg-purple-50 px-4 py-4 sm:px-6">
                            <div className="text-sm">
                                <Link to="#" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">Manage goals &rarr;</Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* List Section */}
            <div className="mt-10 px-4 sm:px-6 lg:px-8">
                <motion.h2 className="text-xl font-bold text-gray-900 mb-4" variants={cardVariants}>Recent Activity</motion.h2>
                <motion.div variants={cardVariants} className="bg-white shadow overflow-hidden sm:rounded-md border border-purple-100">
                    <ul role="list" className="divide-y divide-purple-100">
                        {['Grocery Store', 'Electric Bill', 'Coffee Shop', 'Salary Deposit'].map((item, index) => (
                            <motion.li 
                                key={index}
                                variants={listVariants}
                                whileHover={{ backgroundColor: "var(--color-purple-50)" }}
                                className="transition-colors cursor-pointer"
                            >
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-purple-600 truncate">{item}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {index === 3 ? 'Completed' : 'Processed'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {index === 3 ? '+$4,200.00' : '-$24.00'}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>Just now</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </motion.div>
    );
}