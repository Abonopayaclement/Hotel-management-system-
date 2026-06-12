'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Users, 
  Search,
  Mail,
  Briefcase,
  MoreHorizontal,
  DollarSign,
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';

const StaffPage = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStaff();
  }, [searchQuery]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      const response = await api.get('/staff', { params });
      setStaff(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load staff list');
    } finally {
      setLoading(false);
    }
  };

  const totalPayroll = staff.reduce((sum, s) => sum + s.salary, 0);

  const stats = [
    { label: 'Total Staff', value: staff.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'On Duty', value: staff.length > 0 ? Math.ceil(staff.length * 0.75) : 0, icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Payroll', value: `GH₵${totalPayroll.toLocaleString()}`, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Staff Management</h1>
          <p className="text-gray-500 text-sm">Manage employee profiles, roles and departments.</p>
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
            placeholder="Search staff by name, role or department..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-[40px] border border-gray-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Employee</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Role & Dept</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Monthly Salary</th>
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
                ) : staff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-gray-400 font-semibold">
                      No staff members found.
                    </td>
                  </tr>
                ) : (
                  staff.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center text-primary font-bold">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-secondary">{employee.name}</p>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1"><Mail className="h-3 w-3" /> {employee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-sm font-semibold text-secondary">{employee.position}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{employee.department}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-secondary">GH₵{employee.salary.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-50 text-green-600">
                          Active
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                            <UserCircle className="h-5 w-5" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>
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

export default StaffPage;
