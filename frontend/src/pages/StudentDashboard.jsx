import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from "../utils/api";
import { TimetableGrid } from '../components/ui/TimetableGrid';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, Shield } from 'lucide-react';

export const StudentDashboard = () => {
  const [latestTimetable, setLatestTimetable] = useState(null);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const res = await api.get('/timetables');
        if (res.data.length > 0) {
          setLatestTimetable(res.data[res.data.length - 1]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTimetables();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-12 pb-20"
    >
      {/* Header Section */}
      <div className="glass-card p-12 rounded-[3.5rem] bg-white/[0.01] border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/10 blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">Student Hub</h1>
          <p className="text-white/40 text-xl font-medium leading-relaxed max-w-2xl">
            Access your optimized academic schedule. Conflict-free and designed for clarity.
          </p>
        </div>
      </div>

      {/* Main Timetable Card */}
      <div className="glass-card p-12 rounded-[3.5rem] border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 blur-[100px] pointer-events-none translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 space-y-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="text-3xl font-black flex items-center gap-4 text-white tracking-tight">
              <Calendar className="w-8 h-8 text-primary" />
              Current Semester: {latestTimetable?.title || 'Academic Schedule'}
            </h2>
            
            {latestTimetable ? (
              <div className="flex gap-4">
                <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/export/${latestTimetable._id}/pdf`} target="_blank" rel="noreferrer">
                  <Button variant="secondary" className="px-8 py-3 rounded-2xl text-xs font-black bg-white/5 hover:bg-white/10 border-white/10">Download PDF</Button>
                </a>
              </div>
            ) : (
              <p className="text-center text-foreground/50 py-20 bg-white/5 rounded-xl border border-white/5">
                Schedules are still being processed by the administration. Check back soon.
              </p>
            )}
          </div>

          {latestTimetable && (
            <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-black/20 shadow-inner">
              <TimetableGrid schedule={latestTimetable?.schedule || []} />
            </div>
          )}
        </div>
      </div>

      {/* Quick Links / Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-white/[0.01] group hover:bg-white/[0.04] transition-all duration-500">
          <div className="p-4 bg-primary/10 w-fit rounded-2xl mb-6 group-hover:scale-110 transition-transform">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Live Updates</h3>
          <p className="text-white/40 font-medium leading-relaxed">Your timetable is synced in real-time. Any changes made by the administrator will reflect here instantly.</p>
        </div>
        
        <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-white/[0.01] group hover:bg-white/[0.04] transition-all duration-500">
          <div className="p-4 bg-accent/10 w-fit rounded-2xl mb-6 group-hover:scale-110 transition-transform">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Official Record</h3>
          <p className="text-white/40 font-medium leading-relaxed">This schedule is the official version approved by the Academic Affairs department.</p>
        </div>
      </div>
    </motion.div>
  );
};
