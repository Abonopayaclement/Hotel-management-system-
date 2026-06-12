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
  MoreHorizontal
} from 'lucide-react';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';
import { format } from 'date-fns';

const BookingsPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sampleBookings = [
    {
      id: 1001,
      guest_name: 'John Anderson',
      room_number: 201,
      check_in: '2026-06-15',
      check_out: '2026-06-18',
      guests_count: 2,
      total_price: 750,
      status: 'Confirmed',
      payment_status: 'Paid'
    },
    {
      id: 1002,
      guest_name: 'Sarah Williams',
      room_number: 305,
      check_in: '2026-06-20',
      check_out: '2026-06-25',
      guests_count: 3,
      total_price: 1250,
      status: 'Confirmed',
      payment_status: 'Paid'
    },
    {
      id: 1003,
      guest_name: 'Michael Johnson',
      room_number: 102,
      check_in: '2026-06-16',
      check_out: '2026-06-17',
      guests_count: 1,
      total_price: 350,
      status: 'Checked In',
      payment_status: 'Paid'
    },
    {
      id: 1004,
      guest_name: 'Emma Davis',
      room_number: 410,
      check_in: '2026-06-22',
      check_out: '2026-06-28',
      guests_count: 4,
      total_price: 1800,
      status: 'Pending',
      payment_status: 'Pending'
    },
    {
      id: 1005,
      guest_name: 'Robert Martinez',
      room_number: 203,
      check_in: '2026-06-10',
      check_out: '2026-06-12',
      guests_count: 2,
      total_price: 600,
      status: 'Cancelled',
      payment_status: 'Refunded'
    }
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.data);
    } catch (error) {
      // Use sample data if API fails
      setBookings(sampleBookings);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <ChevronRight className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-50 text-green-600';
      case 'Pending': return 'bg-yellow-50 text-yellow-600';
      case 'Cancelled': return 'bg-red-50 text-red-600';
      case 'Checked In': return 'bg-blue-50 text-blue-600';
      case 'Checked Out': return 'bg-purple-50 text-purple-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Booking Management</h1>
          <p className="text-gray-500 text-sm">Monitor and manage all guest reservations.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Reservation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[32px] border border-gray-50 flex items-center gap-4">
          <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirmed</p>
            <h4 className="text-2xl font-bold text-secondary">{bookings.filter(b => b.status === 'Confirmed').length}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-50 flex items-center gap-4">
          <div className="h-12 w-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</p>
            <h4 className="text-2xl font-bold text-secondary">{bookings.filter(b => b.status === 'Pending').length}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-50 flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Active</p>
            <h4 className="text-2xl font-bold text-secondary">{bookings.filter(b => b.status !== 'Cancelled').length}</h4>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl border border-gray-50 mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by guest name or ID..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <select className="px-5 py-3 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold border-none">
            <option>Recent Bookings</option>
            <option>Upcoming</option>
            <option>Checked In</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-[40px] border border-gray-50 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50">
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Guest</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Room</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Schedule</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse"><td colSpan={6} className="px-8 py-8" /></tr>
              ))
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-secondary">{booking.guest_name}</p>
                    <p className="text-xs text-gray-400">ID: #{booking.id.toString().padStart(5, '0')}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex px-3 py-1 bg-accent/30 text-primary rounded-lg text-xs font-bold">
                      Room {booking.room_number}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-semibold text-secondary">{format(new Date(booking.check_in), 'MMM dd')} - {format(new Date(booking.check_out), 'MMM dd')}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{booking.guests_count} Guests</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-secondary">${booking.total_price}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
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
    </DashboardLayout>
  );
};

export default BookingsPage;
