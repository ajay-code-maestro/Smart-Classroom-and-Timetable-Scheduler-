import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { TimetableGrid } from '../components/ui/TimetableGrid';
import { Users, FileStack, Zap, Calendar, Settings, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [timetables, setTimetables] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subs, rooms, tts] = await Promise.all([
        api.get('/subjects'),
        api.get('/classrooms'),
        api.get('/timetables')
      ]);
      setSubjects(subs.data);
      setClassrooms(rooms.data);
      setTimetables(tts.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await api.post('/timetables/generate', { title: `Fall ${new Date().getFullYear()} Schedule` });
      fetchData(); // Refresh list
      setMessage({ text: 'Timetable generated successfully! Resources optimized.', type: 'success' });
    } catch (e) {
      setMessage({ text: e.response?.data?.message || 'Error generating timetable', type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteTimetable = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      await api.delete(`/timetables/${id}`);
      setTimetables(timetables.filter(tt => tt._id !== id));
      setMessage({ text: 'Timetable deleted successfully.', type: 'success' });
    } catch (e) {
      setMessage({ text: e.response?.data?.message || 'Error deleting timetable', type: 'error' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      {message.text && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={`glass-alert ${message.type === 'success' ? 'glass-alert-success' : 'glass-alert-error'
            }`}
        >
          <Zap className="w-5 h-5" />
          {message.text}
        </motion.div>
      )}

      {/* Header Card */}
      <div className="glass-card p-12 rounded-[3.5rem] border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/10 blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">Command Center</h1>
            <p className="text-white/40 text-xl font-medium leading-relaxed">
              Orchestrate your academic resources with AI-driven precision and beautiful simplicity.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleGenerate}
            className="px-12 py-6 rounded-[2.5rem] text-xl font-black glass-sheen text-white hover:bg-white/10 transition-all duration-500 shadow-2xl shadow-primary/20 flex items-center gap-3 active:scale-95 disabled:opacity-50 border border-white/20 backdrop-blur-3xl group"
            disabled={generating}
          >
            <Zap className={`w-6 h-6 ${generating ? 'animate-pulse' : 'text-primary group-hover:text-white transition-colors'}`} />
            {generating ? 'Optimizing...' : 'Generate New'}
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: 'Subjects', value: subjects.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', link: '/admin/subjects' },
          { label: 'Classrooms', value: classrooms.length, icon: FileStack, color: 'text-purple-400', bg: 'bg-purple-400/10', link: '/admin/classrooms' },
          { label: 'Schedules', value: timetables.length, icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-400/10', link: '#' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={stat.link}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card glass-sheen p-10 rounded-[3rem] flex items-center justify-between border-white/5 hover:bg-white/[0.04] transition-all group h-full shadow-2xl shadow-black/20"
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-4">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{stat.value}</h2>
                    {stat.link !== '#' && (
                      <span className="text-[10px] font-black text-white/20 bg-white/5 px-2 py-1 rounded-md group-hover:bg-primary/20 group-hover:text-primary transition-colors">MANAGE</span>
                    )}
                  </div>
                </div>
                <div className={`p-4 md:p-5 rounded-[1.5rem] ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Timetable List */}
      <div className="glass-card rounded-[3.5rem] p-12 border-white/5 bg-white/[0.01]">
        <h2 className="text-3xl font-black mb-12 flex items-center gap-4 text-white">
          <Calendar className="w-8 h-8 text-primary" />
          Active Schedules
        </h2>

        {timetables.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileStack className="w-10 h-10 text-white/20" />
            </div>
            <p className="text-white/20 text-xl font-bold tracking-tight">No schedules generated yet.</p>
            <p className="text-white/10 text-lg">Add your subjects and rooms, then click 'Generate New'.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {timetables.map(tt => (
              <motion.div
                key={tt._id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                  <div>
                    <h3 className="font-black text-2xl text-white tracking-tight">{tt.title}</h3>
                    <p className="text-white/30 text-sm font-medium">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-4">
                    <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/export/${tt._id}/pdf`} target="_blank" rel="noreferrer">
                      <Button variant="secondary" className="px-6 py-3 rounded-2xl text-xs font-bold hover:bg-white/10">Download PDF</Button>
                    </a>
                    <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/export/${tt._id}/excel`} target="_blank" rel="noreferrer">
                      <Button variant="secondary" className="px-6 py-3 rounded-2xl text-xs font-bold hover:bg-white/10">Export Excel</Button>
                    </a>
                    <Button
                      onClick={() => handleDeleteTimetable(tt._id)}
                      className="p-3 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-all active:scale-90"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-black/20 shadow-inner">
                  <TimetableGrid schedule={tt.schedule} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
};
