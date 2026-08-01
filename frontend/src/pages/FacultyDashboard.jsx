import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { TimetableGrid } from '../components/ui/TimetableGrid';
import { Calendar, Clock, GraduationCap, Laptop } from 'lucide-react';

export const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [mySchedule, setMySchedule] = useState([]);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const res = await api.get('/timetables');
        if (res.data.length > 0) {
          const latest = res.data[res.data.length - 1];
          const personalized = latest.schedule.filter(s => s.facultyId?._id === user._id);
          setMySchedule(personalized);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTimetables();
  }, [user]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-12 pb-20"
    >
      {/* Premium Header */}
      <div className="glass-card p-12 rounded-[3.5rem] bg-white/[0.01] border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent/10 blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black tracking-widest uppercase mb-6">
              <GraduationCap className="w-4 h-4" />
              Faculty Command Hub
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-none">
              Welcome back, <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Prof. {user?.name?.split(' ')[0]}
              </span>
            </h1>
            <p className="text-white/30 text-xl font-medium max-w-xl">
              Your academic teaching matrix is fully optimized and ready for review.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="glass-card p-6 rounded-3xl border-white/5 bg-white/5 text-center min-w-[120px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Today's Classes</p>
                <p className="text-3xl font-black text-white">{mySchedule.filter(s => s.day === ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]).length}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="glass-card p-12 rounded-[3.5rem] border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
        
        <div className="relative z-10 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
              <Calendar className="w-8 h-8 text-accent" />
              Teaching Matrix
            </h2>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white/50">
              Current Session
            </div>
          </div>

          {mySchedule.length === 0 ? (
            <div className="py-24 text-center space-y-6 bg-black/20 rounded-[2.5rem] border border-white/5">
              <Laptop className="w-16 h-16 text-white/10 mx-auto" />
              <p className="text-white/20 text-xl font-bold italic">Your schedule is currently empty.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-black/20 shadow-inner">
              <TimetableGrid schedule={mySchedule} showFaculty={false} />
            </div>
          )}
        </div>
      </div>

      {/* Faculty Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-white/[0.01] group hover:bg-white/[0.04] transition-all duration-500">
           <div className="p-4 bg-primary/10 w-fit rounded-2xl mb-6 group-hover:scale-110 transition-transform">
             <Clock className="w-8 h-8 text-primary" />
           </div>
           <h3 className="text-2xl font-black text-white mb-3">Time Optimization</h3>
           <p className="text-white/30 font-medium leading-relaxed">Your slots were intelligently picked to minimize faculty fatigue and maximize classroom utilization.</p>
        </div>
        <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-white/[0.01] group hover:bg-white/[0.04] transition-all duration-500">
           <div className="p-4 bg-accent/10 w-fit rounded-2xl mb-6 group-hover:scale-110 transition-transform">
             <Laptop className="w-8 h-8 text-accent" />
           </div>
           <h3 className="text-2xl font-black text-white mb-3">Resource Access</h3>
           <p className="text-white/30 font-medium leading-relaxed">Each classroom has been verified for technical readiness according to your subject requirements.</p>
        </div>
      </div>
    </motion.div>
  );
};
