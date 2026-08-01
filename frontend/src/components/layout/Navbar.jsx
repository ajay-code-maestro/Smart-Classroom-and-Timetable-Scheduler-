import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, UserCircle, LogOut, Menu } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-2 bg-black/40 backdrop-blur-2xl border-b border-white/5 shadow-2xl' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
        
        <Link to="/" className="flex items-center gap-4 group flex-auto min-w-0 overflow-visible">
          <div className="flex-shrink-0 p-3 bg-white/5 rounded-2xl group-hover:bg-primary/20 transition-all duration-500 border border-white/10 shadow-2xl">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <span className="font-black md:text-xl text-lg text-white whitespace-nowrap block">
            Smart Classroom & Timetable Scheduler
          </span>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          {user && (
            <Link to={`/${user.role.toLowerCase()}`} className="text-sm font-semibold text-white/70 hover:text-white transition-all duration-300 flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Dashboard</span>
            </Link>
          )}

          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          
          {user ? (
            <button onClick={handleLogout} className="group p-2.5 rounded-2xl bg-destructive/10 hover:bg-destructive/20 transition-all duration-500 hover:scale-110 outline outline-1 outline-destructive/10 text-destructive">
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-white/70 hover:text-white transition-all">
                Sign In
              </Link>
              <Link to="/register" className="glass-button px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-primary/10 border border-white/10 hover:bg-primary/20 transition-all duration-500 hover:shadow-lg hover:shadow-primary/20">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};
