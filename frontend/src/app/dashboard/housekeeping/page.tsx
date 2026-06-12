'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  CheckCircle, 
  Search,
  BedDouble,
  MoreHorizontal,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';

const HousekeepingPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchHousekeeping();
  }, [searchQuery, statusFilter]);

  const fetchHousekeeping = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (statusFilter !== 'All') {
        params.status = statusFilter;
      }
      const response = await api.get('/housekeeping', { params });
      setTasks(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load housekeeping tasks');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Rooms Cleaned Today', value: tasks.filter(t => t.status === 'Completed' || t.status === 'Clean').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Dirty Rooms', value: tasks.filter(t => t.status === 'Dirty').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Cleaning In Progress', value: tasks.filter(t => t.status === 'In Progress').length, icon: RefreshCw, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Tasks Assigned', value: tasks.length, icon: BedDouble, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Clean':
      case 'Completed': 
        return 'bg-green-50 text-green-600';
      case 'Dirty': 
        return 'bg-red-50 text-red-600';
      case 'In Progress': 
        return 'bg-orange-50 text-orange-600';
      default: 
        return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Housekeeping Status</h1>
          <p className="text-gray-500 text-sm">Monitor room cleaning status and assign staff tasks.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <h4 className="text-2xl font-bold text-secondary">{stat.value}</h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-3xl border border-gray-50 mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by room number or staff..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold border-none cursor-pointer focus:ring-0"
          >
            <option value="All">All Statuses</option>
            <option value="Clean">Clean</option>
            <option value="Dirty">Dirty</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Housekeeping Table */}
      <div className="bg-white rounded-[40px] border border-gray-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Room</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Assigned Staff</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Last Cleaned</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-8" />
                    </tr>
                  ))
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-gray-400 font-semibold">
                      No housekeeping tasks found.
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <span className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                            {task.room_number}
                          </span>
                          <p className="text-sm font-bold text-secondary uppercase">Room {task.room_number}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-secondary">{task.staff_name || 'Unassigned'}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs text-gray-500 font-medium">{task.last_cleaned || 'N/A'}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HousekeepingPage;
