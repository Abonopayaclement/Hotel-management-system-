'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  TrendingUp,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const RevenuePageDashboard = () => {
  const [period, setPeriod] = useState('monthly');

  const dailyData = [
    { date: 'Jun 6', revenue: 8500 },
    { date: 'Jun 7', revenue: 9200 },
    { date: 'Jun 8', revenue: 7800 },
    { date: 'Jun 9', revenue: 10200 },
    { date: 'Jun 10', revenue: 9800 },
    { date: 'Jun 11', revenue: 11500 },
  ];

  const revenueStats = [
    { label: 'Today Revenue', value: 'GH₵11,500', change: '+12%', icon: TrendingUp },
    { label: 'Weekly Revenue', value: 'GH₵65,000', change: '+8%', icon: TrendingUp },
    { label: 'Monthly Revenue', value: 'GH₵329,000', change: '+15%', icon: TrendingUp },
    { label: 'Annual Revenue', value: 'GH₵3,948,000', change: '+22%', icon: TrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Revenue Analytics</h1>
        <p className="text-gray-500 text-sm">Track and analyze your hotel revenue streams.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {revenueStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-gray-50 card-hover"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full font-bold">{stat.change}</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-2xl font-bold text-secondary">{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm mb-10"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-secondary">Revenue Trend</h2>
          <div className="flex gap-2">
            {['daily', 'weekly', 'monthly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                  period === p ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `GH₵${value}`} />
            <Area type="monotone" dataKey="revenue" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-secondary mb-8">Revenue by Source</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-secondary mb-6">Room Bookings</h3>
            <div className="space-y-4">
              {[
                { type: 'Single Room', revenue: 85000, percent: 35 },
                { type: 'Double Room', revenue: 105000, percent: 43 },
                { type: 'Suite', revenue: 65000, percent: 27 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-600">{item.type}</p>
                    <p className="font-bold text-secondary">GH₵{item.revenue.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-secondary mb-6">Additional Services</h3>
            <div className="space-y-4">
              {[
                { type: 'Restaurant', revenue: 45000, percent: 60 },
                { type: 'Laundry', revenue: 15000, percent: 20 },
                { type: 'Parking', revenue: 12000, percent: 20 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-600">{item.type}</p>
                    <p className="font-bold text-secondary">GH₵{item.revenue.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default RevenuePageDashboard;
