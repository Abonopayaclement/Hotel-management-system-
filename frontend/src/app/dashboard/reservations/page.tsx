'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Search,
  Filter,
  Calendar,
  Users,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  CreditCard,
  Ban,
  Activity,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';
import { format } from 'date-fns';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Loading States for actions
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/dashboard-reservations');
      setReservations(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      toast.error('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  // Confirm payment handler
  const handleConfirmPayment = async (dbId: number, source: 'room' | 'service') => {
    if (!confirm('Confirm receiving payment for this reservation?')) return;
    setActioningId(`${source}-${dbId}`);
    try {
      const res = await api.post('/payments/complete', {
        source: source === 'room' ? 'booking' : 'service',
        id: dbId,
        method: 'Cash' // Admin logs cash or default payment method
      });
      if (res.data.success) {
        toast.success('Payment confirmed successfully!');
        fetchReservations();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to confirm payment.');
    } finally {
      setActioningId(null);
    }
  };

  // Cancel reservation handler
  const handleCancelReservation = async (dbId: number, source: 'room' | 'service') => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    setActioningId(`${source}-${dbId}`);
    try {
      if (source === 'room') {
        await api.put(`/bookings/${dbId}/status`, { status: 'Cancelled' });
      } else {
        await api.put(`/service-bookings/${dbId}/status`, { status: 'Cancelled' });
      }
      toast.success('Reservation cancelled successfully.');
      fetchReservations();
    } catch (error: any) {
      toast.error('Failed to cancel reservation.');
    } finally {
      setActioningId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'confirmed' || s === 'completed') return 'bg-green-50 text-green-600 border border-green-200';
    if (s === 'pending' || s === 'awaiting payment') return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
    if (s === 'cancelled' || s === 'failed') return 'bg-red-50 text-red-600 border border-red-200';
    return 'bg-gray-50 text-gray-600 border border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'confirmed' || s === 'completed') return <CheckCircle className="h-3 w-3" />;
    if (s === 'pending' || s === 'awaiting payment') return <Clock className="h-3 w-3" />;
    if (s === 'cancelled' || s === 'failed') return <XCircle className="h-3 w-3" />;
    return null;
  };

  // Filter & Search Logic
  const filteredReservations = reservations.filter(res => {
    // 1. Search Query (Guest name or ID)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = String(res.guest_name || '').toLowerCase().includes(q);
      const matchId = String(res.id || '').toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      if (res.category !== selectedCategory) return false;
    }

    // 3. Status Filter
    if (selectedStatus !== 'All') {
      const statusMatch = res.status.toLowerCase() === selectedStatus.toLowerCase() || 
                          (selectedStatus === 'Awaiting Payment' && res.payment_status?.toLowerCase() === 'pending');
      if (!statusMatch) return false;
    }

    // 4. Date Range Filter
    if (startDate) {
      const createdDate = new Date(res.created_at).toISOString().split('T')[0];
      if (createdDate < startDate) return false;
    }
    if (endDate) {
      const createdDate = new Date(res.created_at).toISOString().split('T')[0];
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
    'Pending',
    'Awaiting Payment',
    'Reserved',
    'Cancelled'
  ];

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Reservation Management</h1>
          <p className="text-gray-500 text-sm">Monitor all pending service and room reservations awaiting confirmation.</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Pending Reservations', value: filteredReservations.length, icon: Calendar, color: 'text-primary bg-accent' },
          { label: 'Awaiting Payment', value: filteredReservations.filter(r => r.payment_status?.toLowerCase() === 'pending').length, icon: Clock, color: 'text-yellow-500 bg-yellow-50' },
          { label: 'Rooms Reservations', value: filteredReservations.filter(r => r.category === 'Rooms').length, icon: Users, color: 'text-blue-500 bg-blue-50' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-gray-50 card-hover flex items-center gap-4 shadow-sm"
          >
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-bold text-secondary">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters panel */}
      <div className="bg-white p-6 rounded-3xl border border-gray-50 mb-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Search Input */}
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
          
          {/* Toggles & Selects */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Category Filter */}
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

            {/* Status Filter */}
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

        {/* Date Filters Row */}
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

      {/* Reservations Table */}
      <div className="bg-white rounded-[40px] border border-gray-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Res. ID</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Guest</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Service / Item</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Dates / Schedule</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="px-8 py-8 h-16 bg-gray-55/10" />
                  </tr>
                ))
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-16 text-center text-gray-400 font-medium">
                    No pending reservations match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/30 transition-colors">
                    {/* ID */}
                    <td className="px-8 py-6">
                      <p className="font-bold text-secondary">{res.id}</p>
                      <span className="text-[9px] text-gray-400 block font-sans">
                        Created: {format(new Date(res.created_at), 'yyyy-MM-dd')}
                      </span>
                    </td>
                    {/* Guest */}
                    <td className="px-8 py-6">
                      <p className="text-sm font-semibold text-secondary whitespace-nowrap">{res.guest_name}</p>
                      <p className="text-xs text-gray-400">{res.guest_email}</p>
                    </td>
                    {/* Category */}
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-accent/30 text-primary rounded-lg text-[10px] font-bold uppercase whitespace-nowrap">
                        {res.category}
                      </span>
                    </td>
                    {/* Item Name */}
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-secondary">{res.item_name}</p>
                    </td>
                    {/* Dates */}
                    <td className="px-8 py-6">
                      <p className="text-xs text-gray-600 font-semibold">{res.date}</p>
                    </td>
                    {/* Amount */}
                    <td className="px-8 py-6">
                      <p className="font-bold text-secondary whitespace-nowrap">GH₵{res.amount}</p>
                    </td>
                    {/* Status */}
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${getStatusStyle(res.payment_status)}`}>
                        {getStatusIcon(res.payment_status)}
                        {res.payment_status || 'Pending'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-8 py-6">
                      <div className="flex gap-2 justify-center items-center">
                        {/* Confirm Payment button */}
                        {res.payment_status?.toLowerCase() === 'pending' && (
                          <button
                            onClick={() => handleConfirmPayment(res.dbId, res.source)}
                            disabled={actioningId !== null}
                            title="Confirm Receipt of Payment"
                            className="p-2 bg-green-50 hover:bg-green-500 hover:text-white rounded-xl text-green-600 transition-all cursor-pointer shadow-sm border border-green-100"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                        )}
                        {/* Cancel reservation button */}
                        {res.status?.toLowerCase() !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelReservation(res.dbId, res.source)}
                            disabled={actioningId !== null}
                            title="Cancel Reservation"
                            className="p-2 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl text-red-600 transition-all cursor-pointer shadow-sm border border-red-100"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
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

export default ReservationsPage;
