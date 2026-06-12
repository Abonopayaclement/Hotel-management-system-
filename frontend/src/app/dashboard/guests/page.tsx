'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Users, 
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';

const GuestsPage = () => {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('All');

  useEffect(() => {
    fetchGuests();
  }, [searchQuery, nationalityFilter]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (nationalityFilter !== 'All') {
        params.nationality = nationalityFilter;
      }
      const response = await api.get('/guests', { params });
      setGuests(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Guests', value: guests.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Checked In', value: guests.filter(g => g.status === 'Checked In').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Checked Out', value: guests.filter(g => g.status === 'Checked Out').length, icon: LogOut, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Checked In': return 'bg-green-50 text-green-600';
      case 'Checked Out': return 'bg-gray-50 text-gray-500';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  // Extract unique nationalities for filter options
  const nationalities = ['All', ...Array.from(new Set(guests.map(g => g.nationality).filter(Boolean)))];

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Guest Management</h1>
          <p className="text-gray-500 text-sm">Monitor guest activity and manage profiles.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
            placeholder="Search by name, email or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
          />
        </div>
        <div className="flex gap-3">
          <select
            value={nationalityFilter}
            onChange={(e) => setNationalityFilter(e.target.value)}
            className="px-5 py-3 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold border-none cursor-pointer focus:ring-0"
          >
            <option value="All">All Nationalities</option>
            {nationalities.filter(n => n !== 'All').map((nat) => (
              <option key={nat} value={nat}>{nat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-[40px] border border-gray-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Guest Information</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Assigned Room</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Check In/Out</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-8" />
                    </tr>
                  ))
                ) : guests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-gray-400 font-semibold">
                      No guests found.
                    </td>
                  </tr>
                ) : (
                  guests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center text-primary font-bold">
                            {guest.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-secondary">{guest.name}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-[10px] text-gray-400"><Mail className="h-3 w-3" /> {guest.email}</span>
                              <span className="flex items-center gap-1 text-[10px] text-gray-400"><Phone className="h-3 w-3" /> {guest.phone}</span>
                              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold uppercase">{guest.nationality}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-xs">
                            {guest.room}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">In</p>
                            <p className="text-xs font-semibold text-secondary">{guest.check_in}</p>
                          </div>
                          <div className="h-4 w-[1px] bg-gray-200" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Out</p>
                            <p className="text-xs font-semibold text-secondary">{guest.check_out}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(guest.status)}`}>
                          {guest.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
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

export default GuestsPage;
