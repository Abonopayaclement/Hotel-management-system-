'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  CheckCircle, 
  Search,
  BedDouble,
  RefreshCw,
  AlertCircle,
  Wrench,
  Clock,
  User,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';

const HousekeepingPage = () => {
  const [tasks, setTasks] = useState<any[]>([]); // Housekeeping Cleaning tasks
  const [supportRequests, setSupportRequests] = useState<any[]>([]); // Maintenance/Room support requests
  const [staffList, setStaffList] = useState<any[]>([]); // Staff members
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Navigation tab: 'cleaning' or 'maintenance'
  const [activeTab, setActiveTab] = useState<'cleaning' | 'maintenance'>('cleaning');

  useEffect(() => {
    fetchData();
  }, [searchQuery, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch housekeeping tasks
      const params: any = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (statusFilter !== 'All') {
        params.status = statusFilter;
      }
      const hkResponse = await api.get('/housekeeping', { params });
      setTasks(hkResponse.data.data || []);

      // 2. Fetch support requests
      const supportResponse = await api.get('/support-requests');
      // Filter out general inquiries (must have a room number or match maintenance/cleaning category)
      const allRequests = supportResponse.data.data || [];
      const roomRequests = allRequests.filter((r: any) => r.room_number !== null && r.room_number !== '');
      setSupportRequests(roomRequests);

      // 3. Fetch staff list
      const staffResponse = await api.get('/staff');
      setStaffList(staffResponse.data.data || []);

    } catch (error) {
      toast.error('Failed to load housekeeping and maintenance data');
    } finally {
      setLoading(false);
    }
  };

  // Update Cleaning task status or staff
  const handleUpdateCleaning = async (id: number, updates: { status?: string; staff_id?: any }) => {
    try {
      const res = await api.put(`/housekeeping/${id}`, updates);
      if (res.data.success) {
        toast.success('Cleaning task updated successfully');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update cleaning task');
    }
  };

  // Update Maintenance/Support ticket status
  const handleUpdateMaintenance = async (id: number, status: string) => {
    try {
      const res = await api.put(`/support-requests/${id}`, { status });
      if (res.data.success) {
        toast.success('Maintenance ticket updated successfully');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update maintenance request');
    }
  };

  // Stats calculation
  const stats = [
    { label: 'Rooms Cleaned Today', value: tasks.filter(t => t.status === 'Completed' || t.status === 'Clean').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Dirty Rooms', value: tasks.filter(t => t.status === 'Dirty').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Cleaning In Progress', value: tasks.filter(t => t.status === 'In Progress').length, icon: RefreshCw, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Active Support Tickets', value: supportRequests.filter(s => s.status !== 'Completed').length, icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Clean':
      case 'Completed': 
        return 'bg-green-50 text-green-600 border border-green-200';
      case 'Dirty': 
      case 'Pending':
        return 'bg-red-50 text-red-600 border border-red-200';
      case 'In Progress': 
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'Assigned':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      default: 
        return 'bg-gray-50 text-gray-500 border border-gray-200';
    }
  };

  // Filter maintenance list locally based on search or category
  const filteredMaintenance = supportRequests.filter(req => {
    const matchesSearch = searchQuery.trim() === '' || 
      (req.room_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.guest_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Housekeeping & Maintenance</h1>
          <p className="text-gray-500 text-sm">Monitor room status, cleaning schedules, and guest maintenance tickets.</p>
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

      {/* Tabs Selector */}
      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl mb-8 w-fit">
        <button
          onClick={() => setActiveTab('cleaning')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'cleaning' 
              ? 'bg-white text-secondary shadow-sm' 
              : 'text-gray-500 hover:text-secondary'
          }`}
        >
          <BedDouble className="h-4 w-4" /> Room Cleaning & Housekeeping
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'maintenance' 
              ? 'bg-white text-secondary shadow-sm' 
              : 'text-gray-500 hover:text-secondary'
          }`}
        >
          <Wrench className="h-4 w-4" /> Guest Maintenance & Complaints
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-3xl border border-gray-50 mb-8 flex flex-col md:flex-row gap-4 justify-between shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder={activeTab === 'cleaning' ? "Search by room number or staff..." : "Search room, name, or issue type..."} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-secondary" 
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold border-none cursor-pointer focus:ring-0"
          >
            <option value="All">All Statuses</option>
            {activeTab === 'cleaning' ? (
              <>
                <option value="Clean">Clean</option>
                <option value="Dirty">Dirty</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </>
            ) : (
              <>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Cleaning Tasks Table */}
      {activeTab === 'cleaning' && (
        <div className="bg-white rounded-[40px] border border-gray-50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Room</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Assign Staff</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Last Cleaned</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-8 py-8" />
                      </tr>
                    ))
                  ) : tasks.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-semibold">
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
                          <select
                            value={task.staff_id || 'unassigned'}
                            onChange={(e) => handleUpdateCleaning(task.id, { staff_id: e.target.value })}
                            className="bg-gray-50 text-secondary border border-gray-150 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-0 focus:border-primary cursor-pointer w-48"
                          >
                            <option value="unassigned">Unassigned</option>
                            {staffList.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.position})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs text-gray-500 font-medium">{task.last_cleaned ? new Date(task.last_cleaned).toLocaleString() : 'N/A'}</p>
                        </td>
                        <td className="px-8 py-6">
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateCleaning(task.id, { status: e.target.value })}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase cursor-pointer focus:ring-0 w-36 ${getStatusStyle(task.status)}`}
                          >
                            <option value="Dirty">Dirty</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Clean">Clean</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance & Support Tickets Table */}
      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-[40px] border border-gray-50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Room</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Guest Name</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Issue Type</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date Reported</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Priority</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={7} className="px-8 py-8" />
                      </tr>
                    ))
                  ) : filteredMaintenance.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-8 py-10 text-center text-gray-400 font-semibold">
                        No maintenance or support issues reported for rooms.
                      </td>
                    </tr>
                  ) : (
                    filteredMaintenance.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-6 font-bold text-secondary text-sm">
                          {req.room_number}
                        </td>
                        <td className="px-8 py-6 text-sm text-secondary font-medium">
                          {req.guest_name}
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-2.5 py-1 bg-accent rounded-lg text-xs font-semibold text-primary">
                            {req.category}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-xs text-gray-500 leading-relaxed font-medium max-w-xs truncate" title={req.description}>
                          {req.description}
                        </td>
                        <td className="px-8 py-6 text-xs text-gray-500 font-medium">
                          {new Date(req.created_at).toLocaleString()}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            req.urgency === 'High' ? 'bg-red-100 text-red-700' :
                            req.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {req.urgency}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <select
                            value={req.status}
                            onChange={(e) => handleUpdateMaintenance(req.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase cursor-pointer focus:ring-0 w-36 ${getStatusStyle(req.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HousekeepingPage;
