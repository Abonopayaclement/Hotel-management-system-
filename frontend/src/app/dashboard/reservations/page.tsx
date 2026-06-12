'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Plus, 
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<any[]>([
    { id: 'RES001', guest: 'John Anderson', room: 201, check_in: '2026-06-15', check_out: '2026-06-18', guests: 2, amount: 750, status: 'Confirmed' },
    { id: 'RES002', guest: 'Sarah Williams', room: 305, check_in: '2026-06-20', check_out: '2026-06-25', guests: 3, amount: 1250, status: 'Confirmed' },
    { id: 'RES003', guest: 'Emma Davis', room: 410, check_in: '2026-06-22', check_out: '2026-06-28', guests: 4, amount: 1800, status: 'Pending' },
    { id: 'RES004', guest: 'Michael Johnson', room: 102, check_in: '2026-06-16', check_out: '2026-06-17', guests: 1, amount: 350, status: 'Confirmed' },
  ]);

  const stats = [
    { label: 'Total Reservations', value: reservations.length, icon: Calendar },
    { label: 'Confirmed', value: reservations.filter(r => r.status === 'Confirmed').length, icon: CheckCircle },
    { label: 'Pending', value: reservations.filter(r => r.status === 'Pending').length, icon: Clock },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-50 text-green-600';
      case 'Pending': return 'bg-yellow-50 text-yellow-600';
      case 'Cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Reservation Management</h1>
          <p className="text-gray-500 text-sm">Manage guest reservations and room bookings.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Reservation
        </button>
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
            className="bg-white p-6 rounded-[32px] border border-gray-50 card-hover"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-accent rounded-2xl flex items-center justify-center text-primary">
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
          <input type="text" placeholder="Search by guest name..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm" />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-[40px] border border-gray-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Res. ID</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Guest</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Room</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Dates</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Guests</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-bold text-secondary">{res.id}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-semibold text-secondary whitespace-nowrap">{res.guest}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-accent/30 text-primary rounded-lg text-xs font-bold whitespace-nowrap">Room {res.room}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-gray-600 whitespace-nowrap">{res.check_in} to {res.check_out}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        {res.guests}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-secondary whitespace-nowrap">GH₵{res.amount}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${getStatusStyle(res.status)}`}>
                        {getStatusIcon(res.status)}
                        {res.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReservationsPage;
