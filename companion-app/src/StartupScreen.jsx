import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function StartupScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 3500);
    const t4 = setTimeout(() => { 
      if (onComplete) onComplete(); 
    }, 4500);
    
    return () => { 
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); 
    };
  }, [onComplete]);

  const skipStartup = () => {
    if (onComplete) onComplete();
  };

  const LobsterLogo = () => (
    <svg viewBox="0 0 100 100" className="w-32 h-32">
      <motion.path 
        d="M30 60 Q20 40 30 30 Q40 20 50 25 Q60 20 70 30 Q80 40 70 60 Q80 80 70 90 Q50 100 30 90 Q20 80 30 60"
        fill="#ff4500"
        initial={{ scale: 0 }}
        animate={{ scale: phase >= 1 ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      />
      <motion.path
        d="M25 35 Q10 25 15 15 Q25 20 30 30"
        fill="#ff4500"
        initial={{ rotate: -30, x: -20 }}
        animate={{ rotate: phase >= 2 ? 0 : -30, x: phase >= 2 ? 0 : -20 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      <motion.path
        d="M75 35 Q90 25 85 15 Q75 20 70 30"
        fill="#ff4500"
        initial={{ rotate: 30, x: 20 }}
        animate={{ rotate: phase >= 2 ? 0 : 30, x: phase >= 2 ? 0 : 20 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      <circle cx="42" cy="35" r="3" fill="white" />
      <circle cx="58" cy="35" r="3" fill="white" />
      <circle cx="42" cy="35" r="1.5" fill="black" />
      <circle cx="58" cy="35" r="1.5" fill="black" />
      <motion.path d="M40 25 L35 10" stroke="#ff4500" strokeWidth="2" fill="none"
        animate={{ rotate: phase >= 2 ? -10 : 0 }}
      />
      <motion.path d="M60 25 L65 10" stroke="#ff4500" strokeWidth="2" fill="none"
        animate={{ rotate: phase >= 2 ? 10 : 0 }}
      />
      <motion.path d="M35 85 Q50 95 65 85" stroke="#ff4500" strokeWidth="4" fill="none"
        animate={{ d: phase >= 2 ? "M35 85 Q50 95 65 85" : "M40 85 Q50 90 60 85" }}
      />
    </svg>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: phase >= 4 ? 0 : 1 }}
      exit={{ opacity: 0 }}
      onClick={skipStartup}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center cursor-pointer"
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#ff4500]/10"
            style={{
              left: `${i * 5}%`,
              top: 0,
              bottom: 0,
              width: 1
            }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
          />
        ))}
      </div>
      
      <LobsterLogo />
      
      <motion.h1 
        className="text-2xl font-bold text-white mt-6 tracking-[0.3em]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
      >
        LABRINA
      </motion.h1>
      
      <motion.p 
        className="text-xs text-[#ff4500] mt-2 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.7 : 0 }}
      >
        v2.0.26 // NEURAL_INTERFACE
      </motion.p>
      
      {phase >= 2 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-20"
        >
          <p className="text-[10px] text-white/50 font-mono">
            {phase === 2 && '▌ INITIALIZING NEURAL LINK...'}
            {phase === 3 && '✓ CORTEX CONNECTED'}
          </p>
          <div className="w-40 h-1 bg-white/10 rounded mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-[#ff4500]"
              initial={{ width: 0 }}
              animate={{ width: phase === 3 ? '100%' : '60%' }}
            />
          </div>
          <p className="text-[8px] text-white/30 mt-2 text-center">TAP TO SKIP</p>
        </motion.div>
      )}
      
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#ff4500]/50" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#ff4500]/50" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#ff4500]/50" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#ff4500]/50" />
    </motion.div>
  );
}
