import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from "../utils/api";
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FileStack, Plus, Trash2, ArrowLeft, Users, Clock, Code, Pencil, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [labs, setLabs] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    facultyId: '',
    hoursPerWeek: 3
  });

  const [labFormData, setLabFormData] = useState({
    name: '',
    code: '',
    facultyId: '',
    day: 'Monday',
    startSlot: '09:00',
    duration: 3
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isEditingLab, setIsEditingLab] = useState(false);
  const [editLabId, setEditLabId] = useState(null);
  
  const [message, setMessage] = useState({ text: '', type: '' });

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const START_SLOTS = ['09:00', '13:00'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subs, users, labsData] = await Promise.all([
        api.get('/subjects'),
        api.get('/auth/users'),
        api.get('/labs')
      ]);
      setSubjects(subs.data);
      setFaculty(users.data.filter(u => u.role === 'faculty'));
      setLabs(labsData.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/subjects/${editId}`, formData);
        setMessage({ text: 'Subject updated successfully!', type: 'success' });
      } else {
        if (subjects.length >= 7) {
          setMessage({ text: 'Subject limit reached (max 7).', type: 'error' });
          setLoading(false);
          return;
        }
        await api.post('/subjects', formData);
        setMessage({ text: 'Subject added successfully!', type: 'success' });
      }
      setFormData({ name: '', code: '', facultyId: '', hoursPerWeek: 3 });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error processing subject', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLabSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditingLab) {
        await api.put(`/labs/${editLabId}`, labFormData);
        setMessage({ text: 'Lab Session updated successfully!', type: 'success' });
      } else {
        if (labs.length >= 3) {
          setMessage({ text: 'Lab limit reached (max 3).', type: 'error' });
          setLoading(false);
          return;
        }
        await api.post('/labs', labFormData);
        setMessage({ text: 'Lab Session added successfully!', type: 'success' });
      }
      setLabFormData({ name: '', code: '', facultyId: '', day: 'Monday', startSlot: '09:00', duration: 3 });
      setIsEditingLab(false);
      setEditLabId(null);
      fetchData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error processing lab session', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = (subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      facultyId: subject.facultyId?._id || subject.facultyId,
      hoursPerWeek: subject.hoursPerWeek
    });
    setIsEditing(true);
    setEditId(subject._id);
    setMessage({ text: '', type: '' });
  };

  const handleEditLab = (lab) => {
    setLabFormData({
      name: lab.name,
      code: lab.code,
      facultyId: lab.facultyId?._id || lab.facultyId,
      day: lab.day,
      startSlot: lab.startSlot,
      duration: lab.duration
    });
    setIsEditingLab(true);
    setEditLabId(lab._id);
    setMessage({ text: '', type: '' });
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await api.delete(`/subjects/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLab = async (id) => {
    if (!window.confirm('Delete this lab session?')) return;
    try {
      await api.delete(`/labs/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-12 pb-20"
    >
      <div className="flex items-center justify-between">
        <Link to="/admin">
          <Button variant="ghost" className="flex items-center gap-2 text-white/60 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-4xl font-black text-white tracking-tighter">Academic Planning</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Forms Section */}
        <div className="lg:col-span-1 space-y-8">
          {/* Subject Form */}
          <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">{isEditing ? 'Edit Subject' : 'Add New Subject'}</h2>
              <p className="text-white/40 font-medium">Define academic requirements.</p>
            </div>

            <form onSubmit={handleSubjectSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <Code className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Code (e.g., CS101)" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="pl-16 bg-white/[0.03] border-white/5 rounded-2xl h-14"
                    required
                  />
                </div>
                <Input 
                  placeholder="Subject Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/[0.03] border-white/5 rounded-2xl h-14 px-6"
                  required
                />
                <select 
                  value={formData.facultyId}
                  onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-6 text-white/60 focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  required
                >
                  <option value="" className="bg-slate-900">Select Faculty</option>
                  {faculty.map(f => (
                    <option key={f._id} value={f._id} className="bg-slate-900">{f.name}</option>
                  ))}
                </select>
                <div className="space-y-1">
                  <label className="text-white/40 text-[10px] font-black uppercase ml-4">Hours / Week</label>
                  <Input 
                    type="number" max="3" min="1"
                    value={formData.hoursPerWeek}
                    onChange={(e) => setFormData({...formData, hoursPerWeek: parseInt(e.target.value) || 0})}
                    className="bg-white/[0.03] border-white/5 rounded-2xl h-14 px-6"
                    required
                  />
                </div>
              </div>

              <Button 
                variant="secondary"
                type="submit" 
                disabled={loading || (!isEditing && subjects.length >= 7)}
                className="w-full h-14 rounded-2xl glass-sheen text-white font-black hover:bg-white/10 flex items-center justify-center gap-3 transition-all active:scale-95 border border-white/20"
              >
                {isEditing ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isEditing ? 'Update Subject' : 'Add Subject'}
              </Button>
              {!isEditing && subjects.length >= 7 && <p className="text-red-400/60 text-center text-[10px] font-black uppercase">Max Limit Reached</p>}
            </form>
          </div>

          {/* Lab Session Form */}
          <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8 bg-primary/5">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">{isEditingLab ? 'Edit Lab' : 'Add Lab Session'}</h2>
              <p className="text-white/40 font-medium">Configure continuous lab blocks.</p>
            </div>

            <form onSubmit={handleLabSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input 
                  placeholder="Lab Name (e.g., Computer Lab)" 
                  value={labFormData.name}
                  onChange={(e) => setLabFormData({...labFormData, name: e.target.value})}
                  className="bg-white/[0.03] border-white/5 rounded-2xl h-14 px-6"
                  required
                />
                <Input 
                  placeholder="Lab Code" 
                  value={labFormData.code}
                  onChange={(e) => setLabFormData({...labFormData, code: e.target.value})}
                  className="bg-white/[0.03] border-white/5 rounded-2xl h-14 px-6"
                  required
                />
                <select 
                  value={labFormData.facultyId}
                  onChange={(e) => setLabFormData({...labFormData, facultyId: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-6 text-white/60 appearance-none"
                  required
                >
                  <option value="" className="bg-slate-900">Select Lab Faculty</option>
                  {faculty.map(f => (
                    <option key={f._id} value={f._id} className="bg-slate-900">{f.name}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    value={labFormData.day}
                    onChange={(e) => setLabFormData({...labFormData, day: e.target.value})}
                    className="bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-6 text-white/60 appearance-none"
                    required
                  >
                    {DAYS.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                  </select>
                  <select 
                    value={labFormData.startSlot}
                    onChange={(e) => setLabFormData({...labFormData, startSlot: e.target.value})}
                    className="bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-6 text-white/60 appearance-none"
                    required
                  >
                    {START_SLOTS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                  </select>
                </div>
              </div>

              <Button 
                variant="primary"
                type="submit" 
                disabled={loading || (!isEditingLab && labs.length >= 3)}
                className="w-full h-14 rounded-2xl glass-sheen bg-primary/20 hover:bg-primary/30 text-primary font-black flex items-center justify-center gap-3 transition-all border border-primary/30"
              >
                {isEditingLab ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isEditingLab ? 'Update Lab' : 'Add Lab Session'}
              </Button>
              {!isEditingLab && labs.length >= 3 && <p className="text-primary/60 text-center text-[10px] font-black uppercase">Max 3 Labs Allowed</p>}
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-12">
          {message.text && (
            <div className={`glass-alert py-4 px-8 text-center ${message.type === 'success' ? 'glass-alert-success' : 'glass-alert-error'}`}>
              {message.text}
            </div>
          )}

          {/* Subjects List */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white/30 uppercase tracking-[0.2em] ml-4">Scheduled Subjects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map(subject => (
                <motion.div key={subject._id} layout className="p-8 rounded-[2.5rem] glass-card border-white/5 bg-white/[0.02] group relative">
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button onClick={() => handleEditSubject(subject)} className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-primary hover:text-white transition-all"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteSubject(subject._id)} className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-primary uppercase">{subject.code}</span>
                      <h3 className="text-2xl font-black text-white tracking-tight">{subject.name}</h3>
                    </div>
                    <div className="flex gap-4">
                       <span className="text-xs font-medium text-white/40 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {subject.facultyId?.name}</span>
                       <span className="text-xs font-medium text-white/40 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {subject.hoursPerWeek} hrs</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Labs List */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-primary/30 uppercase tracking-[0.2em] ml-4">Lab Sessions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {labs.map(lab => (
                <motion.div key={lab._id} layout className="p-8 rounded-[2.5rem] glass-card border-primary/20 bg-primary/[0.03] group relative shadow-lg shadow-primary/5">
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button onClick={() => handleEditLab(lab)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteLab(lab._id)} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-primary uppercase">{lab.code} • LAB SESSION</span>
                      <h3 className="text-2xl font-black text-white tracking-tight">{lab.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                       <span className="text-xs font-medium text-white/40 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {lab.facultyId?.name}</span>
                       <span className="text-xs font-medium text-white/60 bg-primary/20 px-3 py-1 rounded-full">{lab.day} • {lab.startSlot}</span>
                       <span className="text-xs font-medium text-primary/80 border border-primary/20 px-3 py-1 rounded-full">{lab.duration} HR BLOCK</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
