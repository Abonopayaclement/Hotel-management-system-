'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Users, 
  BedDouble, 
  CalendarCheck, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
  BrushCleaning,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const StatCard = ({ label, value, icon: Icon, trend, trendValue }: any) => (
  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex flex-col justify-between h-48 card-hover">
    <div className="flex justify-between items-start">
      <div className="h-12 w-12 bg-accent rounded-2xl flex items-center justify-center text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
        trend === 'up' ? 'text-success bg-green-50' : 'text-danger bg-red-50'
      }`}>
        {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {trendValue}
      </div>
    </div>
    <div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-secondary">{value}</h3>
    </div>
  </div>
);

const chartData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
];

const DashboardOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const hasFinancialAccess = ['Super Admin', 'Hotel Manager', 'Accountant'].includes(user?.role || '');
        const endpoint = hasFinancialAccess ? '/dashboard/stats' : '/dashboard/public-stats';
        const response = await api.get(endpoint);
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };
    if (user) {
      fetchStats();
    }
  }, [user]);

  const hasFinancialAccess = ['Super Admin', 'Hotel Manager', 'Accountant'].includes(user?.role || '');

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.name || 'User'}! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <StatCard 
          label="Total Guests" 
          value={stats?.totalGuests ?? '0'} 
          icon={Users} 
          trend="up" 
          trendValue="+12%" 
        />
        <StatCard 
          label="Active Bookings" 
          value={stats?.totalBookings ?? '0'} 
          icon={CalendarCheck} 
          trend="up" 
          trendValue="+5%" 
        />
        <StatCard 
          label="Available Rooms" 
          value={stats?.availableRooms ?? '0'} 
          icon={BedDouble} 
          trend="down" 
          trendValue="-2%" 
        />
        {hasFinancialAccess ? (
          <StatCard 
            label="Today's Revenue" 
            value={`GH₵${stats?.revenueToday ?? '0'}`} 
            icon={DollarSign} 
            trend="up" 
            trendValue="+8%" 
          />
        ) : (
          <StatCard 
            label="Occupied Rooms" 
            value={stats?.occupiedRooms ?? '0'} 
            icon={BedDouble} 
            trend="up" 
            trendValue="+4%" 
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conditional Left Widget: Revenue trends or Room Occupancy Summary */}
        {hasFinancialAccess ? (
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-secondary">Revenue Trends</h3>
              <select className="bg-gray-50 border-none text-xs font-bold rounded-xl px-4 py-2 text-gray-500">
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B8860B" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#B8860B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#999' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#999' }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#B8860B" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-secondary mb-2">Room Occupancy & Status</h3>
              <p className="text-gray-400 text-xs mb-8">Real-time breakdown of all room statuses in the hotel.</p>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Available Rooms', value: stats?.availableRooms ?? 0, total: stats?.totalRooms ?? 1, color: 'bg-green-500', text: 'text-green-600 bg-green-50' },
                { label: 'Occupied Rooms', value: stats?.occupiedRooms ?? 0, total: stats?.totalRooms ?? 1, color: 'bg-blue-500', text: 'text-blue-600 bg-blue-50' },
                { label: 'Reserved Rooms', value: stats?.reservedRooms ?? 0, total: stats?.totalRooms ?? 1, color: 'bg-purple-500', text: 'text-purple-600 bg-purple-50' },
                { label: 'Rooms Cleaning', value: stats?.cleaningRooms ?? 0, total: stats?.totalRooms ?? 1, color: 'bg-yellow-500', text: 'text-yellow-600 bg-yellow-50' },
                { label: 'Under Maintenance', value: stats?.maintenanceRooms ?? 0, total: stats?.totalRooms ?? 1, color: 'bg-red-500', text: 'text-red-600 bg-red-50' },
              ].map((status, index) => {
                const percentage = Math.round((status.value / (stats?.totalRooms || 1)) * 100);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-secondary">{status.label}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${status.text}`}>
                        {status.value} rooms ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${status.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50">
          <h3 className="text-xl font-bold text-secondary mb-8">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { user: 'Sarah Johnson', action: 'New Booking', time: '2 mins ago', color: 'bg-green-500' },
              { user: 'Room 204', action: 'Checked Out', time: '15 mins ago', color: 'bg-blue-500' },
              { user: 'Inventory', action: 'Low Stock Alert', time: '1 hour ago', color: 'bg-red-500' },
              { user: 'Michael Chen', action: 'New Review', time: '2 hours ago', color: 'bg-yellow-500' },
              { user: 'Housekeeping', action: 'Shift Started', time: '4 hours ago', color: 'bg-purple-500' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${item.color}`} />
                <div>
                  <p className="text-sm font-bold text-secondary leading-none mb-1">{item.action}</p>
                  <p className="text-xs text-gray-500 mb-1">{item.user}</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-gray-50 text-gray-500 rounded-2xl text-xs font-bold hover:bg-gray-100 transition-all uppercase tracking-widest">
            View All Logs
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
