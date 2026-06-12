'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Download, 
  FileText,
  Calendar,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const revenueData = [
    { name: 'Jan', revenue: 45000, bookings: 120, occupancy: 85 },
    { name: 'Feb', revenue: 52000, bookings: 135, occupancy: 88 },
    { name: 'Mar', revenue: 48000, bookings: 125, occupancy: 82 },
    { name: 'Apr', revenue: 61000, bookings: 150, occupancy: 92 },
    { name: 'May', revenue: 58000, bookings: 145, occupancy: 90 },
    { name: 'Jun', revenue: 65000, bookings: 160, occupancy: 95 },
  ];

  const stats = [
    { label: 'Total Revenue', value: 'GH₵329,000', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Bookings', value: '735', icon: BarChart3, color: 'text-blue-500' },
    { label: 'Avg Occupancy', value: '88.7%', icon: BarChart3, color: 'text-purple-500' },
    { label: 'Avg Review', value: '4.8/5', icon: BarChart3, color: 'text-yellow-500' },
  ];

  const reports = [
    { id: 1, title: 'Daily Revenue Report', type: 'Daily', date: '2026-06-11', format: 'PDF' },
    { id: 2, title: 'Weekly Occupancy Report', type: 'Weekly', date: '2026-06-11', format: 'Excel' },
    { id: 3, title: 'Monthly Financial Report', type: 'Monthly', date: '2026-06-01', format: 'PDF' },
    { id: 4, title: 'Yearly Business Summary', type: 'Yearly', date: '2026-01-01', format: 'Excel' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm">Generate and view comprehensive reports.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-gray-50 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`h-10 w-10 rounded-lg bg-accent flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-2xl font-bold text-secondary">{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm mb-10"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-secondary">Revenue Trend</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod('daily')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedPeriod === 'daily' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setSelectedPeriod('weekly')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedPeriod === 'weekly' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedPeriod === 'monthly' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500'}`}
            >
              Monthly
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Occupancy Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm mb-10"
      >
        <h2 className="text-2xl font-bold text-secondary mb-8">Occupancy Rate</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="occupancy" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Generated Reports */}
      <div>
        <h2 className="text-2xl font-bold text-secondary mb-6">Generated Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-[24px] border border-gray-50 hover:shadow-premium transition-all card-hover flex items-start justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-accent/30 rounded-xl flex items-center justify-center text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary mb-1">{report.title}</h3>
                  <div className="flex gap-3">
                    <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-lg font-semibold">{report.type}</span>
                    <span className="text-xs px-2 py-1 bg-accent/30 text-primary rounded-lg font-semibold">{report.format}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{report.date}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all">
                <Download className="h-5 w-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
