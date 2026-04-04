import { motion, type Variants } from "framer-motion";

export function Component() {
    const listVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <motion.div 
            className="py-6 w-full max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div 
                className="px-4 sm:px-6 lg:px-8 mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="mt-2 text-sm text-gray-600">Update your account information and preferences.</p>
            </motion.div>

            <motion.div 
                className="px-4 sm:px-6 lg:px-8"
                variants={listVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="bg-white shadow rounded-lg border border-purple-100 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-5 bg-purple-50 sm:px-6 border-b border-purple-100 flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600" />
                        
                        <motion.div 
                            className="h-16 w-16 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl border-2 border-purple-300"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            JD
                        </motion.div>
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">John Doe</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">john.doe@example.com</p>
                        </div>
                    </div>

                    {/* Form Details */}
                    <div className="px-4 py-5 sm:p-6">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <motion.div variants={itemVariants} className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                        First name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            defaultValue="John"
                                            className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border transition-shadow"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="sm:col-span-3">
                                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                        Last name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="last-name"
                                            id="last-name"
                                            defaultValue="Doe"
                                            className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border transition-shadow"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue="john.doe@example.com"
                                            className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border transition-shadow"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="sm:col-span-6">
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                        Bio
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="about"
                                            name="about"
                                            rows={3}
                                            className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3 transition-shadow"
                                            defaultValue="Enthusiastic FinHack participant."
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="pt-5 border-t border-purple-100 flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                >
                                    Save
                                </motion.button>
                            </motion.div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}