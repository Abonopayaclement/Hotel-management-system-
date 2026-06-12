'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hotel, Mail, Lock, User, ArrowRight, Loader2, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      if (response.data.success) {
        toast.success('Registration successful! Please login.');
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        {/* Left Side - Visual */}
        <div className="hidden md:flex md:w-1/2 bg-premium-gradient relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <Link href="/" className="relative z-10 flex items-center gap-2 text-white">
            <Hotel className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tighter">HOLY STAR</span>
          </Link>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Join the <br />
              <span className="text-gold-gradient">Holy Star Family</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Create an account to book your stay, manage your preferences, and access exclusive member benefits.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-white/40 text-xs tracking-widest uppercase">
            <span>Member Benefits</span>
            <div className="w-8 h-[1px] bg-white/20" />
            <span>Priority Booking</span>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-3xl font-bold text-secondary mb-2">Create Account</h3>
            <p className="text-gray-500 text-sm mb-10">Sign up to experience luxury hospitality.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 disabled:opacity-50 mt-6"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign Up <ArrowRight className="h-5 w-5" /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login here</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
