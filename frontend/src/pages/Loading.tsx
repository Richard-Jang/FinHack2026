import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function Component() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
      {/* Outer wrapper to maintain layout flow while separating background and icon logic */}
      <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
        {/* Rotating gradient background */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1], 
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 bg-gradient-to-br from-purple-600 to-fuchsia-700 rounded-2xl shadow-xl shadow-purple-500/30"
        />
        
        {/* Static icon overlaid on top */}
        <div className="relative z-10 flex items-center justify-center">
          <ShieldCheck className="text-white" size={56} />
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-purple-800 text-2xl font-semibold tracking-wide"
        >
          Loading Wallet Watch
        </motion.p>
        <div className="flex space-x-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: dot * 0.15,
                ease: "circOut"
              }}
              className="w-2.5 h-2.5 bg-purple-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
