import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0, 
      transition: { 
        duration: 0.5,
        when: "afterChildren"
      } 
    },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "backOut"
      }
    }
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: { 
        duration: 3, 
        repeat: Infinity, 
        ease: "linear" 
      }
    }
  };

  const particleVariants = {
    animate: (i) => ({
      scale: [1, 1.5, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay: i * 0.15,
        ease: "easeInOut"
      }
    })
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 0.4, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0  flex flex-col items-center justify-center z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative w-40 h-40">
        {/* Main orbiting ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-teal-400/30"
          variants={orbitVariants}
          animate="animate"
        />
        
        {/* Secondary orbiting ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-teal-300/20"
          variants={orbitVariants}
          animate="animate"
          style={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full`}
            style={{
              top: "10%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              transformOrigin: "20px 20px",
              rotate: i * 60
            }}
            custom={i}
            variants={particleVariants}
            animate="animate"
          />
        ))}
        
        {/* Central pulse effect */}
        <motion.div
          className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-cyan-500/20"
          variants={pulseVariants}
          animate="animate"
        />
        
        {/* Logo/text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={logoVariants}
        >
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-white to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: 0.4,
                  duration: 0.6,
                  ease: "backOut"
                } 
              }}
            >
              Career Counsellor
            </motion.div>
            <motion.div
              className="text-sm text-black mt-2"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.8,
                transition: { 
                  delay: 0.6,
                  duration: 0.4
                } 
              }}
            >
              Loading your experience
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Progress indicator */}
      <motion.div 
        className="mt-8 w-40 h-1 bg-indigo-700 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { delay: 0.4 }
        }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ 
            width: "100%",
            transition: { 
              duration: 3,
              ease: "linear"
            } 
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Loader;