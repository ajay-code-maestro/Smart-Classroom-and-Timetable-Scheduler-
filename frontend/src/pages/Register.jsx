import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' // ✅ FIXED (lowercase)
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );

      if (user && user.role) {
        navigate(`/${user.role}`);
      } else {
        navigate('/student');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-6 mt-12">
      <div className="fixed inset-0 liquid-mesh opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card w-full max-w-lg p-12 rounded-[3.5rem]"
      >
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-black text-white">Join the Platform</h2>
            <p className="text-white/30">Create your optimized academic account.</p>
          </div>

          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />

            {/* ✅ FIXED ROLE */}
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-3 rounded-xl bg-black text-white"
            >
              <option value="admin">Administrator</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />

            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Sign Up'}
            </Button>

          </form>

          <p className="text-center text-white/40">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};