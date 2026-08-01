import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from "../utils/api";
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { MapPin, Plus, Trash2, ArrowLeft, Users, Zap, Pencil, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClassroomManagement = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: 30,
    features: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/classrooms');
      setClassrooms(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const featuresArr = formData.features.split(',').map(f => f.trim()).filter(f => f);
      const data = { ...formData, features: featuresArr };
      
      if (isEditing) {
        await api.put(`/classrooms/${editId}`, data);
        setMessage({ text: 'Classroom updated successfully!', type: 'success' });
      } else {
        await api.post('/classrooms', data);
        setMessage({ text: 'Classroom added successfully!', type: 'success' });
      }
      
      setFormData({ name: '', capacity: 30, features: '' });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error saving classroom', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setIsEditing(true);
    setEditId(room._id);
    setFormData({
      name: room.name,
      capacity: room.capacity,
      features: room.features?.join(', ') || ''
    });
    setMessage({ text: '', type: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', capacity: 30, features: '' });
    setMessage({ text: '', type: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this classroom?')) return;
    try {
      await api.delete(`/classrooms/${id}`);
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
        <h1 className="text-4xl font-black text-white tracking-tighter">Room Intelligence</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Card */}
        <div className="lg:col-span-1">
          <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8 sticky top-32">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">
                {isEditing ? 'Update Room' : 'Register Room'}
              </h2>
              <p className="text-white/40 font-medium">
                {isEditing ? 'Modify your room configuration.' : 'Map your physical infrastructure.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Room Name (e.g., Lab A)" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-16 bg-white/[0.03] border-white/5 rounded-2xl h-16 focus:bg-white/[0.07] transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/40 text-xs font-black uppercase ml-4">Student Capacity</label>
                  <Input 
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                    className="bg-white/[0.03] border-white/5 rounded-2xl h-16 px-6 font-bold"
                    required
                  />
                </div>
                <Input 
                  placeholder="Features (comma separated: Projector, AC)" 
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="bg-white/[0.03] border-white/5 rounded-2xl h-16 px-6"
                />
              </div>

              {message.text && (
                <div className={`glass-alert py-3 px-6 text-sm mb-6 ${
                  message.type === 'success' ? 'glass-alert-success' : 'glass-alert-error'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-[1.5rem] bg-primary text-white font-black text-lg hover:scale-[1.02] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-primary/20 hover:shadow-primary/40 border border-white/10"
                >
                  {isEditing ? <Zap className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  {loading ? 'Processing...' : isEditing ? 'Update Classroom' : 'Add Classroom'}
                </Button>

                {isEditing && (
                  <Button 
                    onClick={handleCancelEdit}
                    variant="secondary"
                    className="w-full h-14 rounded-[1.2rem] border-white/10 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" /> Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Card */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-[3.5rem] p-10 border-white/5 bg-white/[0.01]">
            <div className="space-y-6">
              {classrooms.length === 0 ? (
                <div className="py-20 text-center opacity-20">
                  <Zap className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl font-bold">No classrooms registered yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {classrooms.map(room => (
                    <motion.div 
                      key={room._id}
                      layout
                      className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-6 right-6 flex items-center gap-2 z-30">
                        <button 
                          onClick={() => handleEdit(room)}
                          className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-primary hover:text-white transition-all"
                          title="Edit Room"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(room._id)}
                          className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Room"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1 pr-24">
                          <h3 className="text-2xl font-black text-white tracking-tight">{room.name}</h3>
                          <div className="flex items-center gap-2 text-white/40 text-sm font-medium">
                            <Users className="w-4 h-4" />
                            Capacity: {room.capacity} Students
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {room.features.map((feature, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
