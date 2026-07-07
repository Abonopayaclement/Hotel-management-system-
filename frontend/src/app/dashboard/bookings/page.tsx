'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  MoreHorizontal,
  LogIn,
  LogOut,
  Sparkles,
  Users
} from 'lucide-react';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const BookingsPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Actioning loading state
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/dashboard-bookings');
      setBookings(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  // Check-In / Check-Out / Complete action handlers
  const handleUpdateStatus = async (dbId: number, source: 'room' | 'service', newStatus: string) => {
    if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) return;
    setActioningId(`${source}-${dbId}`);
    try {
      if (source === 'room') {
        await api.put(`/bookings/${dbId}/status`, { status: newStatus });
      } else {
        await api.put(`/service-bookings/${dbId}/status`, { status: newStatus });
      }
      toast.success(`Booking status updated to ${newStatus}`);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status.');
    } finally {
      setActioningId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'confirmed' || s === 'completed') return <CheckCircle className="h-3 w-3 text-green-500" />;
    if (s === 'pending') return <Clock className="h-3 w-3 text-yellow-500" />;
    if (s === 'cancelled') return <XCircle className="h-3 w-3 text-red-500" />;
    return <ChevronRight className="h-3 w-3 text-gray-500" />;
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-50 text-green-600 border border-green-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
      case 'Cancelled': return 'bg-red-50 text-red-600 border border-red-200';
      case 'Checked In': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'Checked Out': return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'Completed': return 'bg-gray-50 text-gray-600 border border-gray-200';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  // Filter & Search logic
  const filteredBookings = bookings.filter(b => {
    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = String(b.guest_name || '').toLowerCase().includes(q);
      const matchId = String(b.id || '').toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      if (b.category !== selectedCategory) return false;
    }

    // 3. Status Filter
    if (selectedStatus !== 'All') {
      if (b.status.toLowerCase() !== selectedStatus.toLowerCase()) return false;
    }

    // 4. Date Range Filter
    if (startDate) {
      const createdDate = new Date(b.created_at).toISOString().split('T')[0];
      if (createdDate < startDate) return false;
    }
    if (endDate) {
      const createdDate = new Date(b.created_at).toISOString().split('T')[0];
      if (createdDate > endDate) return false;
    }

    return true;
  });

  const categories = [
    'All',
    'Rooms',
    'Gym',
    'Spa / Massage',
    'Clinic',
    'Conference Hall',
    'Sports Complex',
    'Indoor Games',
    'Restaurant'
  ];

  const statuses = [
    'All',
    'Confirmed',
    'Checked In',
    'Checked Out',
    'Completed',
    'Cancelled'
  ];

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Booking Management</h1>
          <p className="text-gray-500 text-sm">Monitor and manage all confirmed bookings and check-in statuses.</p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[32px] border border-gray-50 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active & Confirmed</p>
            <h4 className="text-2xl font-bold text-secondary">
              {filteredBookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In').length}
            </h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-50 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</p>
            <h4 className="text-2xl font-bold text-secondary">
              {filteredBookings.filter(b => b.status === 'Completed' || b.status === 'Checked Out').length}
            </h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-50 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Bookings</p>
            <h4 className="text-2xl font-bold text-secondary">{filteredBookings.length}</h4>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-3xl border border-gray-50 mb-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by guest name or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            />
          </div>

          {/* Select dropdowns */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Category:</span>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-secondary focus:outline-none cursor-pointer"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Status:</span>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-secondary focus:outline-none cursor-pointer"
              >
                {statuses.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Date Filter Row */}
        <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">From:</span>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-50 border-none rounded-xl text-xs font-semibold p-2 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">To:</span>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-50 border-none rounded-xl text-xs font-semibold p-2 focus:outline-none"
            />
          </div>
          {(startDate || endDate || searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All') && (
            <button 
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-[40px] border border-gray-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Booking ID</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Guest</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Service / Item</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Dates / Schedule</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="px-8 py-8 h-16" />
                  </tr>
                ))
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-16 text-center text-gray-400 font-medium">
                    No confirmed bookings match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/30 transition-colors">
                    {/* ID */}
                    <td className="px-8 py-6">
                      <p className="font-bold text-secondary">{booking.id}</p>
                      <span className="text-[9px] text-gray-400 block">
                        Created: {format(new Date(booking.created_at), 'yyyy-MM-dd')}
                      </span>
                    </td>
                    {/* Guest Details */}
                    <td className="px-8 py-6">
                      <p className="font-bold text-secondary whitespace-nowrap">{booking.guest_name}</p>
                      <p className="text-xs text-gray-400">{booking.guest_email}</p>
                    </td>
                    {/* Category */}
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-accent/30 text-primary rounded-lg text-[10px] font-bold uppercase whitespace-nowrap">
                        {booking.category}
                      </span>
                    </td>
                    {/* Service Name */}
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-secondary">{booking.item_name}</p>
                    </td>
                    {/* Schedule */}
                    <td className="px-8 py-6">
                      <p className="text-xs text-gray-600 font-semibold">{booking.date}</p>
                      {booking.guests_count && (
                        <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" /> {booking.guests_count} Guests
                        </p>
                      )}
                    </td>
                    {/* Amount */}
                    <td className="px-8 py-6">
                      <p className="font-bold text-secondary">GH₵{booking.amount}</p>
                    </td>
                    {/* Status Badge */}
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${getStatusStyle(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    {/* Operational Action Button */}
                    <td className="px-8 py-6 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        {/* Rooms Check In action */}
                        {booking.source === 'room' && booking.status === 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(booking.dbId, 'room', 'Checked In')}
                            disabled={actioningId !== null}
                            title="Check-In Guest"
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          >
                            <LogIn className="h-3.5 w-3.5" /> Check In
                          </button>
                        )}
                        {/* Rooms Check Out action */}
                        {booking.source === 'room' && booking.status === 'Checked In' && (
                          <button
                            onClick={() => handleUpdateStatus(booking.dbId, 'room', 'Checked Out')}
                            disabled={actioningId !== null}
                            title="Check-Out Guest"
                            className="px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-600 hover:text-white rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          >
                            <LogOut className="h-3.5 w-3.5" /> Check Out
                          </button>
                        )}
                        {/* Services Complete action */}
                        {booking.source === 'service' && booking.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(booking.dbId, 'service', 'Completed')}
                            disabled={actioningId !== null}
                            title="Complete Service Appointment"
                            className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-100 hover:bg-green-600 hover:text-white rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Complete
                          </button>
                        )}
                        {booking.status === 'Checked Out' || booking.status === 'Completed' ? (
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Processed</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingsPage;
