import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Users, Zap, Search, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="relative -mt-24 w-full">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 liquid-mesh pointer-events-none opacity-40 z-0" />
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center relative space-y-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-primary-foreground/90 text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-3xl shadow-xl shadow-black/5">
            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
            Empowering Academic Intelligence
          </motion.div>
          
          <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.85] text-white">
            <motion.span variants={itemVariants} className="block">Schedule Smarter</motion.span>
            <motion.span variants={itemVariants} className="block bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              Future Today.
            </motion.span>
          </h1>
          
          <motion.p variants={itemVariants} className="max-w-xl mx-auto text-xl md:text-2xl text-white/40 font-semibold leading-snug tracking-tight">
            The next generation of academic planning. <br className="hidden md:block" />
            Intelligent, conflict-free, and stunningly beautiful.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 pt-10">
            <Link to="/register">
              <Button className="px-12 py-6 rounded-[2.5rem] text-lg font-black bg-primary text-white shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-105 transition-all duration-500 hover:shadow-primary/50 border border-white/10">
                Get Started
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="px-12 py-6 rounded-[2.5rem] text-lg font-black hover:bg-white/10 transition-all duration-500 border-white/10 backdrop-blur-3xl">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Apple-style floating orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none -z-10" />
      </section>

      {/* Feature Section with Bento-style Grid */}
      <section className="max-w-7xl mx-auto px-6 py-32 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <div className="md:col-span-2 glass-card p-12 rounded-[3.5rem] border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
            <Zap className="w-12 h-12 text-primary mb-8" />
            <h3 className="text-4xl font-black mb-6 tracking-tighter text-white">AI Conflict Solver</h3>
            <p className="text-white/40 text-xl font-medium leading-relaxed max-w-lg">
              Our advanced constraint-based engine solves complex scheduling puzzles in milliseconds, ensuring 100% clash-free timetables every time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-12 rounded-[3.5rem] border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <Calendar className="w-12 h-12 text-accent mb-8" />
            <h3 className="text-4xl font-black mb-6 tracking-tighter text-white">Fluid Grid</h3>
            <p className="text-white/40 text-xl font-medium leading-relaxed">
              Beautifully responsive views for any device.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-12 rounded-[3.5rem] border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <Users className="w-12 h-12 text-emerald-400 mb-8" />
            <h3 className="text-4xl font-black mb-6 tracking-tighter text-white">Smart Sync</h3>
            <p className="text-white/40 text-xl font-medium leading-relaxed">
              Instant updates across all portals.
            </p>
          </div>

          {/* Card 4 */}
          <div className="md:col-span-2 glass-card p-12 rounded-[3.5rem] border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 blur-[120px] pointer-events-none" />
            <Sparkles className="w-12 h-12 text-yellow-400 mb-8" />
            <h3 className="text-4xl font-black mb-6 tracking-tighter text-white">Premium Aesthetics</h3>
            <p className="text-white/40 text-xl font-medium leading-relaxed max-w-lg">
              Designed with a "Liquid Glass" theme that feels premium and modern, setting a new standard for academic enterprise software.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
