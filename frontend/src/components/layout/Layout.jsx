import React from 'react';
import { Navbar } from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const Layout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen liquid-bg text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="liquid-mesh animate-pulse-slow" />
        
        {/* Floating Accent Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-blob mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-blob [animation-delay:-5s] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full animate-pulse-slow" />
        
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 bg-noise" />
      </div>
      
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 min-h-screen"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
};
