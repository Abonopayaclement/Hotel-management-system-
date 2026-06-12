'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentsPage = () => {
  const [payments] = useState<any[]>([
    { id: 'PAY001', booking: 'BK1001', guest: 'John Anderson', amount: 750, status: 'Paid', date: '2026-06-15', method: 'Credit Card' },
    { id: 'PAY002', booking: 'BK1002', guest: 'Sarah Williams', amount: 1250, status: 'Paid', date: '2026-06-20', method: 'Bank Transfer' },
    { id: 'PAY003', booking: 'BK1003', guest: 'Michael Johnson', amount: 350, status: 'Paid', date: '2026-06-16', method: 'Credit Card' },
    { id: 'PAY004', booking: 'BK1004', guest: 'Emma Davis', amount: 1800, status: 'Pending', date: '2026-06-22', method: 'Credit Card' },
    { id: 'PAY005', booking: 'BK1005', guest: 'Robert Martinez', amount: 600, status: 'Failed', date: '2026-06-10', method: 'Debit Card' }
  ]);

  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const failedCount = payments.filter(p => p.status === 'Failed').length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-50 text-green-600';
      case 'Pending': return 'bg-yellow-50 text-yellow-600';
      case 'Failed': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Failed': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Payment Management</h1>
          <p className="text-gray-500 text-sm">Track all payment transactions and invoices.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-6 rounded-[32px] border border-gray-50 flex items-center gap-4 card-hover">
          <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
            <h4 className="text-2xl font-bold text-secondary">GH₵{totalRevenue.toLocaleString()}</h4>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-[32px] border border-gray-50 flex items-center gap-4 card-hover">
          <div className="h-12 w-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Amount</p>
            <h4 className="text-2xl font-bold text-secondary">GH₵{pendingAmount}</h4>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-[32px] border border-gray-50 flex items-center gap-4 card-hover">
          <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Failed</p>
            <h4 className="text-2xl font-bold text-secondary">{failedCount}</h4>
          </div>
        </motion.div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-3xl border border-gray-50 mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search by payment ID..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm" />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-[40px] border border-gray-50 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50">
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment ID</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Guest</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Method</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-8 py-6">
                  <p className="font-bold text-secondary">{payment.id}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm text-gray-600">{payment.guest}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="font-bold text-secondary">GH₵{payment.amount}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm text-gray-600">{payment.method}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm text-gray-600">{payment.date}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    {payment.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
