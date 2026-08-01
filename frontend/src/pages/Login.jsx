import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user && user.role) {
        navigate(`/${user.role.toLowerCase()}`);
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center p-6">
      <div className="fixed inset-0 liquid-mesh opacity-20 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-md p-12 rounded-[3.5rem] relative overflow-hidden group border-white/5 bg-white/[0.01]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter">Welcome Back</h2>
            <p className="text-white/30 text-lg font-medium">Continue your academic journey.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-2xl text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="professor@university.edu"
                required
                className="rounded-2xl border-white/5 bg-white/5 focus:bg-white/10 transition-all font-medium py-4"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                className="rounded-2xl border-white/5 bg-white/5 focus:bg-white/10 transition-all font-medium py-4"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full py-6 rounded-[2rem] text-lg font-black bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <footer className="text-center pt-4">
            <p className="text-white/30 text-sm font-medium">
              New here?{' '}
              <Link to="/register" className="text-white hover:text-primary transition-colors font-black underline underline-offset-4 decoration-white/10">Create Account</Link>
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};
