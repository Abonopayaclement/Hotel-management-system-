'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hotel, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast, Toaster } from 'sonner';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        login(response.data.user, response.data.token);
        toast.success('Login successful! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 1000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side - Image/Branding */}
        <div className="hidden md:flex md:w-1/2 bg-premium-gradient relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <Link href="/" className="relative z-10 flex items-center gap-2 text-white">
            <Hotel className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tighter">HOLY STAR</span>
          </Link>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Welcome back to <br />
              <span className="text-gold-gradient">Elite Hospitality</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Manage your bookings, guests, and hotel operations with our world-class 
              management system. Efficiency at your fingertips.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-white/40 text-xs tracking-widest uppercase">
            <span>Security Verified</span>
            <div className="w-8 h-[1px] bg-white/20" />
            <span>256-Bit Encryption</span>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-3xl font-bold text-secondary mb-2">Staff Login</h3>
            <p className="text-gray-500 text-sm mb-10">Enter your credentials to access the dashboard.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@holystar.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-gray-500">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-primary font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign In <ArrowRight className="h-5 w-5" /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Not a staff member? <Link href="/register" className="text-primary font-bold hover:underline">Register here</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
