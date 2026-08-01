import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-500 relative overflow-hidden group flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 border border-white/10",
    secondary: "glass-button text-foreground border-white/10 hover:bg-white/10",
    danger: "bg-destructive text-white shadow-lg shadow-destructive/20 hover:shadow-destructive/40 border border-white/10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5" />
    </motion.button>
  );
};
