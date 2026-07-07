'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  TrendingUp,
  Calendar,
  Printer,
  FileText,
  RefreshCw,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';
import { format } from 'date-fns';

const FinancePage = () => {
  // Filter States
  const [dateRange, setDateRange] = useState('All');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomDates, setShowCustomDates] = useState(false);

  // Data States
  const [stats, setStats] = useState<any>({
    totalRevenue: 5390,
    todayRevenue: 85,
    weeklyRevenue: 1335,
    monthlyRevenue: 5390,
    yearlyRevenue: 5390,
    pendingAmount: 3745,
    completedCount: 6,
    failedCount: 2,
    totalTransactions: 10
  });

  const [breakdown, setBreakdown] = useState<any[]>([
    { category: 'Rooms', revenue: 4100, percent: 76 },
    { category: 'Reservations', revenue: 1250, percent: 23 },
    { category: 'Restaurant', revenue: 440, percent: 8 },
    { category: 'Massage / Spa', revenue: 150, percent: 3 },
    { category: 'Clinic', revenue: 120, percent: 2 },
    { category: 'Laundry', revenue: 0, percent: 0 },
    { category: 'Conference Hall', revenue: 0, percent: 0 },
    { category: 'Gym / Sports / Games', revenue: 50, percent: 1 },
    { category: 'Other Services', revenue: 0, percent: 0 }
  ]);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selected Transaction for Details Modal
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);

  // Report Generator States
  const [reportType, setReportType] = useState('full');
  const [reportPreview, setReportPreview] = useState<any | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Fallback Mock Data matching the SQLite database seeds
  const mockTransactions = [
    { id: 'PAY-1', transaction_id: 'TXN001', guest_name: 'John Anderson', category: 'Rooms', reference: 'BK1', amount: 450.00, method: 'Visa Card', status: 'Paid', date: '2026-06-15T12:00:00.000Z' },
    { id: 'PAY-2', transaction_id: 'TXN002', guest_name: 'Sarah Williams', category: 'Rooms', reference: 'BK2', amount: 1250.00, method: 'Visa Card', status: 'Paid', date: '2026-06-20T14:30:00.000Z' },
    { id: 'PAY-3', transaction_id: 'TXN003', guest_name: 'Michael Johnson', category: 'Rooms', reference: 'BK3', amount: 1200.00, method: 'Mastercard', status: 'Paid', date: '2026-06-12T09:15:00.000Z' },
    { id: 'PAY-4', transaction_id: 'TXN-BK-4', guest_name: 'Emma Davis', category: 'Reservations', reference: 'BK4', amount: 3600.00, method: 'Mobile Money', status: 'Pending', date: '2026-06-22T11:00:00.000Z' },
    { id: 'PAY-5', transaction_id: 'TXN004', guest_name: 'Robert Martinez', category: 'Rooms', reference: 'BK5', amount: 2400.00, method: 'Visa Card', status: 'Paid', date: '2026-06-10T15:45:00.000Z' },
    { id: 'PAY-6', transaction_id: 'TXN005', guest_name: 'Abonopaya Clement', category: 'Reservations', reference: 'BK6', amount: 150.00, method: 'Cash', status: 'Failed', date: '2026-06-08T08:30:00.000Z' },
    
    // Food Orders
    { id: 'FOOD-1', transaction_id: 'TXN-FD-1', guest_name: 'John Anderson', category: 'Restaurant', reference: 'Room 101', amount: 120.00, method: 'Mobile Money', status: 'Paid', date: '2026-06-16T12:30:00.000Z' },
    { id: 'FOOD-2', transaction_id: 'TXN-FD-2', guest_name: 'Sarah Williams', category: 'Restaurant', reference: 'Room 201', amount: 85.00, method: 'Mobile Money', status: 'Pending', date: '2026-06-23T13:15:00.000Z' },
    { id: 'FOOD-3', transaction_id: 'TXN-FD-3', guest_name: 'John Anderson', category: 'Restaurant', reference: 'Room 101', amount: 320.00, method: 'Mobile Money', status: 'Paid', date: '2026-06-20T20:00:00.000Z' },
    { id: 'FOOD-4', transaction_id: 'TXN-FD-4', guest_name: 'Sarah Williams', category: 'Restaurant', reference: 'Room 201', amount: 95.00, method: 'Mobile Money', status: 'Failed', date: '2026-06-22T18:45:00.000Z' },
    
    // Service Bookings
    { id: 'SRV-1', transaction_id: 'TXN-SRV-1', guest_name: 'John Anderson', category: 'Massage / Spa', reference: 'Massage / Spa Center', amount: 150.00, method: 'Cash', status: 'Paid', date: '2026-06-16T10:00:00.000Z' },
    { id: 'SRV-2', transaction_id: 'TXN-SRV-2', guest_name: 'Sarah Williams', category: 'Gym / Sports / Games', reference: 'Gym / Fitness Center', amount: 50.00, method: 'Cash', status: 'Paid', date: '2026-06-21T08:00:00.000Z' },
    { id: 'SRV-3', transaction_id: 'TXN-SRV-3', guest_name: 'Sarah Williams', category: 'Laundry', reference: 'Laundry', amount: 60.00, method: 'Cash', status: 'Pending', date: '2026-06-23T09:00:00.000Z' },
    { id: 'SRV-4', transaction_id: 'TXN-SRV-4', guest_name: 'John Anderson', category: 'Conference Hall', reference: 'Conference Hall', amount: 1500.00, method: 'Cash', status: 'Pending', date: '2026-06-22T11:30:00.000Z' },
    { id: 'SRV-5', transaction_id: 'TXN-SRV-5', guest_name: 'Sarah Williams', category: 'Clinic', reference: 'Clinic', amount: 120.00, method: 'Cash', status: 'Paid', date: '2026-06-18T10:30:00.000Z' }
  ];

  // Daily revenue chart data (derived dynamically or fallback)
  const chartData = [
    { date: 'Jun 08', revenue: 0 },
    { date: 'Jun 10', revenue: 2400 },
    { date: 'Jun 12', revenue: 1200 },
    { date: 'Jun 15', revenue: 450 },
    { date: 'Jun 16', revenue: 270 }, // sandwich (120) + massage (150)
    { date: 'Jun 18', revenue: 120 }, // clinic (120)
    { date: 'Jun 20', revenue: 1570 }, // booking 2 (1250) + pizza (320)
    { date: 'Jun 21', revenue: 50 }, // gym (50)
    { date: 'Jun 23', revenue: 85 } // today Momo
  ];

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const params: any = {
        status: statusFilter,
        source: categoryFilter,
        method: methodFilter,
        search: searchQuery
      };

      if (dateRange !== 'All') {
        params.dateRange = dateRange;
      }
      if (dateRange === 'Custom' && customStart && customEnd) {
        params.startDate = customStart;
        params.endDate = customEnd;
      }

      const response = await api.get('/finance', { params });
      if (response.data.success) {
        setStats(response.data.stats);
        setBreakdown(response.data.breakdown);
        setTransactions(response.data.transactions);
        setPendingPayments(response.data.pendingPayments);
      }
    } catch (error) {
      console.warn('API error, falling back to rich mock data:', error);
      // Run local client-side filter mock data
      filterMockData();
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterMockData = () => {
    let filtered = [...mockTransactions];

    // Status Filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(t => t.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Category Filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(t => t.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Method Filter
    if (methodFilter !== 'All') {
      filtered = filtered.filter(t => {
        const m = t.method.toLowerCase();
        const f = methodFilter.toLowerCase();
        if (f === 'card') return m.includes('card') || m.includes('visa') || m.includes('mastercard');
        return m === f;
      });
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.guest_name.toLowerCase().includes(q) ||
        t.transaction_id.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q)
      );
    }

    // Date Filter (Simulated for Mock data)
    const todayStr = '2026-06-23';
    if (dateRange === 'Today') {
      filtered = filtered.filter(t => t.date.startsWith(todayStr));
    } else if (dateRange === 'This Week') {
      const weekAgo = new Date('2026-06-16T00:00:00');
      filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
    } else if (dateRange === 'This Month') {
      filtered = filtered.filter(t => t.date.includes('-06-'));
    } else if (dateRange === 'Custom' && customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      end.setHours(23,59,59);
      filtered = filtered.filter(t => {
        const d = new Date(t.date);
        return d >= start && d <= end;
      });
    }

    setTransactions(filtered);

    // Calculate mockup stats
    const paidList = mockTransactions.filter(t => t.status === 'Paid');
    const pendingList = mockTransactions.filter(t => t.status === 'Pending');
    const failedList = mockTransactions.filter(t => t.status === 'Failed');

    const totalRev = paidList.reduce((sum, t) => sum + t.amount, 0);
    const pendAmt = pendingList.reduce((sum, t) => sum + t.amount, 0);
    const todayRev = paidList.filter(t => t.date.startsWith(todayStr)).reduce((sum, t) => sum + t.amount, 0);

    setStats({
      totalRevenue: totalRev,
      todayRevenue: todayRev,
      weeklyRevenue: paidList.filter(t => new Date(t.date) >= new Date('2026-06-16')).reduce((sum, t) => sum + t.amount, 0),
      monthlyRevenue: totalRev,
      yearlyRevenue: totalRev,
      pendingAmount: pendAmt,
      completedCount: paidList.length,
      failedCount: failedList.length,
      totalTransactions: mockTransactions.length
    });

    // Populate pending list
    setPendingPayments(pendingList);
  };

  useEffect(() => {
    fetchFinanceData();
  }, [dateRange, statusFilter, categoryFilter, methodFilter, searchQuery, customStart, customEnd]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchFinanceData();
  };

  const handleMarkAsPaid = async (txnId: string) => {
    try {
      const response = await api.post(`/finance/${txnId}/pay`);
      if (response.data.success) {
        toast.success('Payment marked as paid successfully!');
        fetchFinanceData();
      }
    } catch (error) {
      console.warn('API mark as paid failed, updating mock data locally:', error);
      // Update mock data local state
      const itemIdx = mockTransactions.findIndex(t => t.id === txnId);
      if (itemIdx !== -1) {
        mockTransactions[itemIdx].status = 'Paid';
        if (!mockTransactions[itemIdx].transaction_id || mockTransactions[itemIdx].transaction_id.startsWith('TXN-')) {
          mockTransactions[itemIdx].transaction_id = `TXN${Math.floor(100 + Math.random() * 900)}`;
        }
        toast.success('Payment marked as paid (Local Fallback)!');
        filterMockData();
      }
    }
  };

  // CSV Exporter for Transactions
  const exportToCSV = (data: any[], filename = 'finance_transactions.csv') => {
    if (!data.length) {
      toast.error('No data available to export');
      return;
    }

    const headers = ['Transaction ID', 'Guest Name', 'Category', 'Reference', 'Amount (GH₵)', 'Payment Method', 'Status', 'Date/Time'];
    const rows = data.map(t => [
      t.transaction_id,
      t.guest_name,
      t.category,
      t.reference,
      t.amount,
      t.method,
      t.status,
      format(new Date(t.date), 'yyyy-MM-dd HH:mm')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${filename} exported successfully!`);
  };

  const generateReportPreview = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      let filtered = [...transactions];
      if (reportType === 'pending') {
        filtered = transactions.filter(t => t.status === 'Pending');
      } else if (reportType === 'category') {
        filtered = transactions.filter(t => t.status === 'Paid');
      }

      const total = filtered.reduce((sum, t) => sum + t.amount, 0);
      const paid = filtered.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
      const pending = filtered.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);
      const failed = filtered.filter(t => t.status === 'Failed').reduce((sum, t) => sum + t.amount, 0);

      setReportPreview({
        type: reportType,
        generatedAt: new Date().toISOString(),
        transactionsCount: filtered.length,
        totalAmount: total,
        paidAmount: paid,
        pendingAmount: pending,
        failedAmount: failed,
        data: filtered
      });
      setGeneratingReport(false);
      toast.success('Report preview generated!');
    }, 800);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-50 text-green-600 border border-green-100';
      case 'Pending': return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
      case 'Failed': return 'bg-red-50 text-red-600 border border-red-100';
      case 'Refunded': return 'bg-purple-50 text-purple-600 border border-purple-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="h-3.5 w-3.5" />;
      case 'Pending': return <Clock className="h-3.5 w-3.5" />;
      case 'Failed': return <XCircle className="h-3.5 w-3.5" />;
      case 'Refunded': return <AlertCircle className="h-3.5 w-3.5" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      
      {/* Title Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2 flex items-center gap-3">
            <span>Finance Management</span>
            <button 
              onClick={handleRefresh} 
              className={`p-1.5 hover:bg-gray-100 rounded-xl transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="h-5 w-5 text-gray-400 hover:text-primary" />
            </button>
          </h1>
          <p className="text-gray-500 text-sm">Monitor and control your hotel revenue, payments, restaurant invoices, and service activities.</p>
        </div>
        <button 
          onClick={() => exportToCSV(transactions, `finance_report_${format(new Date(), 'yyyyMMdd')}.csv`)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all flex items-center gap-2 self-stretch lg:self-auto justify-center"
        >
          <Download className="h-4 w-4" />
          Export All Transactions
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 card-hover">
          <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
            <h4 className="text-2xl font-bold text-secondary">GH₵{stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h4>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 card-hover">
          <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Today's Revenue</p>
            <h4 className="text-2xl font-bold text-secondary">GH₵{stats.todayRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h4>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 card-hover">
          <div className="h-12 w-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Payments</p>
            <h4 className="text-2xl font-bold text-secondary">GH₵{stats.pendingAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h4>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 card-hover">
          <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Transactions</p>
            <h4 className="text-2xl font-bold text-secondary">{stats.totalTransactions} ({stats.completedCount} Paid)</h4>
          </div>
        </motion.div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-10">
        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          Filters & Search Parameters
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Search */}
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-bold text-gray-400 block mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Guest, Booking, TXN ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all font-medium text-secondary"
              />
            </div>
          </div>

          {/* Date range selection */}
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setShowCustomDates(e.target.value === 'Custom');
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all font-semibold text-secondary"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
              <option value="Custom">Custom Date...</option>
            </select>
          </div>

          {/* Source/Category selection */}
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Revenue Category</label>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all font-semibold text-secondary"
            >
              <option value="All">All Categories</option>
              <option value="Rooms">Rooms</option>
              <option value="Reservations">Reservations</option>
              <option value="Restaurant">Restaurant (Food & Drinks)</option>
              <option value="Laundry">Laundry</option>
              <option value="Massage / Spa">Massage & Spa</option>
              <option value="Clinic">Clinic</option>
              <option value="Conference Hall">Conference Hall</option>
              <option value="Gym / Sports / Games">Gym / Sports / Games</option>
              <option value="Other Services">Other Services</option>
            </select>
          </div>

          {/* Payment Status selection */}
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Payment Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all font-semibold text-secondary"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Payment Method selection */}
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Payment Method</label>
            <select 
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all font-semibold text-secondary"
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Card">Card Payment (Visa/Master)</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Custom date range inputs */}
        <AnimatePresence>
          {showCustomDates && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100"
            >
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Start Date</label>
                <input 
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all font-semibold text-secondary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">End Date</label>
                <input 
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all font-semibold text-secondary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Grid: Transactions Table & Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
              <h2 className="text-lg font-bold text-secondary">Transaction Ledger</h2>
              <span className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary rounded-full">{transactions.length} record(s)</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Transaction ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Guest / Reference</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Method</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                          <span>Loading financial records...</span>
                        </div>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No transaction records found matching your filters.</td>
                    </tr>
                  ) : (
                    transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-5">
                          <p className="font-bold text-secondary text-sm">{txn.transaction_id}</p>
                          <span className="text-[10px] text-gray-400">{format(new Date(txn.date), 'yyyy-MM-dd HH:mm')}</span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-secondary">{txn.guest_name}</p>
                          <span className="text-xs text-gray-500 font-mono">Ref: {txn.reference}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-semibold text-gray-600">{txn.category}</span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-secondary text-sm">GH₵{txn.amount.toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs text-gray-600">{txn.method}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(txn.status)}`}>
                            {getStatusIcon(txn.status)}
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => setSelectedTxn(txn)}
                              className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-all"
                              title="View Details"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {txn.status === 'Pending' && (
                              <button 
                                onClick={() => handleMarkAsPaid(txn.id)}
                                className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 rounded-lg text-[10px] font-bold transition-all"
                              >
                                Mark Paid
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
        </div>

        {/* Category Breakdown Panel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-gray-50 pb-4 mb-6">
              <h2 className="text-lg font-bold text-secondary">Revenue by Category</h2>
              <p className="text-gray-400 text-xs">Breakdown of settled payments</p>
            </div>
            
            <div className="space-y-4">
              {breakdown.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <p className="font-semibold text-gray-600">{item.category}</p>
                    <p className="font-bold text-secondary">
                      GH₵{item.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                      <span className="text-[10px] text-gray-400 font-normal ml-1">({item.percent}%)</span>
                    </p>
                  </div>
                  <div className="w-full bg-gray-50 border border-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-primary' : 
                        index === 1 ? 'bg-indigo-500' :
                        index === 2 ? 'bg-amber-500' :
                        index === 3 ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm">GH₵</div>
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Gross Revenue Summary</h5>
              <p className="text-lg font-black text-secondary">GH₵{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Revenue Trend Chart & Pending Outstanding Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* Area Chart Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="border-b border-gray-50 pb-4 mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-secondary">Revenue Velocity</h2>
              <p className="text-gray-400 text-xs">Time series mapping of settled income</p>
            </div>
            <div className="h-8 px-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              June 2026
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip formatter={(value) => [`GH₵${value}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending & Outstandings Panel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-gray-50 pb-4 mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-secondary">Outstanding Balances</h2>
                <p className="text-gray-400 text-xs">Pending transactions awaiting settlement</p>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 bg-yellow-50 text-yellow-600 rounded-full border border-yellow-100">
                GH₵{stats.pendingAmount.toLocaleString()} Due
              </span>
            </div>

            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {pendingPayments.length === 0 ? (
                <p className="text-sm text-center text-gray-400 py-12">No outstanding payments at the moment.</p>
              ) : (
                pendingPayments.map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-2xl flex justify-between items-center transition-all">
                    <div>
                      <p className="text-xs font-bold text-secondary">{item.guest_name}</p>
                      <div className="flex gap-2 text-[10px] text-gray-400 font-semibold mt-0.5">
                        <span>Ref: {item.reference}</span>
                        <span>•</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-black text-secondary">GH₵{item.amount.toFixed(2)}</p>
                      <button 
                        onClick={() => handleMarkAsPaid(item.id)}
                        className="px-3 py-1.5 bg-primary text-white font-bold rounded-xl text-[10px] shadow-md shadow-primary/10 hover:bg-primary/95 transition-all"
                      >
                        Settle
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 mt-4 flex justify-between items-center text-xs">
            <span className="font-bold text-gray-400">Total Unsettled Invoices:</span>
            <span className="font-black text-amber-600">{pendingPayments.length} invoices</span>
          </div>
        </div>

      </div>

      {/* Row 3: Finance Report Generator */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-10">
        <h2 className="text-xl font-bold text-secondary mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Finance Report Generator
        </h2>
        <p className="text-gray-400 text-xs mb-6">Compile dynamic reports based on current system datasets, and export structured sheets.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Report configuration inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Report Context</label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all font-semibold text-secondary"
              >
                <option value="full">Full Transactions Audit</option>
                <option value="daily">Daily Financial Summary</option>
                <option value="category">Revenue by Service/Category</option>
                <option value="pending">Outstanding Payments Audit</option>
              </select>
            </div>
            
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-secondary">Export Note</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Clicking generate compiles transactions matching the filters in real-time. Exported files will be generated as structured CSV sheets matching finance ledger schemas.
              </p>
            </div>

            <button 
              onClick={generateReportPreview}
              disabled={generatingReport}
              className="w-full py-3.5 bg-secondary text-white font-bold rounded-xl text-xs hover:bg-secondary/95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generatingReport ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Compiling...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate Report Preview
                </>
              )}
            </button>
          </div>

          {/* Report Preview screen */}
          <div className="lg:col-span-2 bg-gray-50/50 border border-gray-100 rounded-2xl p-6 min-h-[220px] flex flex-col justify-between">
            {reportPreview ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start border-b border-gray-200/60 pb-3">
                    <div>
                      <h4 className="font-bold text-secondary uppercase text-xs tracking-wider">
                        {reportPreview.type === 'full' && 'Full Transactions Audit'}
                        {reportPreview.type === 'daily' && 'Daily Financial Summary'}
                        {reportPreview.type === 'category' && 'Revenue by Service / Category'}
                        {reportPreview.type === 'pending' && 'Outstanding Payments Audit'}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold">Generated on: {format(new Date(reportPreview.generatedAt), 'yyyy-MM-dd HH:mm:ss')}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-200">Active Audit</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div className="bg-white p-3 border border-gray-100 rounded-xl">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Records Count</p>
                      <p className="text-sm font-bold text-secondary mt-0.5">{reportPreview.transactionsCount}</p>
                    </div>
                    <div className="bg-white p-3 border border-gray-100 rounded-xl">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Settled Revenue</p>
                      <p className="text-sm font-bold text-green-600 mt-0.5">GH₵{reportPreview.paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 border border-gray-100 rounded-xl">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Unsettled Amount</p>
                      <p className="text-sm font-bold text-amber-500 mt-0.5">GH₵{reportPreview.pendingAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 border border-gray-100 rounded-xl">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Failed Amount</p>
                      <p className="text-sm font-bold text-red-500 mt-0.5">GH₵{reportPreview.failedAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 pt-4 border-t border-gray-200/60">
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-white border border-gray-100 text-gray-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-all"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print Screen
                  </button>
                  <button 
                    onClick={() => exportToCSV(reportPreview.data, `finance_report_${reportPreview.type}_${format(new Date(), 'yyyyMMdd')}.csv`)}
                    className="px-4 py-2.5 bg-primary text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 hover:bg-primary/95 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export Preview as CSV
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center my-auto py-8">
                <FileText className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-500">No report preview loaded.</p>
                <p className="text-xs text-gray-400 mt-1 max-w-[280px]">Choose a report context on the left and click "Generate Report Preview".</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Selected Transaction Details Modal */}
      <AnimatePresence>
        {selectedTxn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
            >
              {/* Header */}
              <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-secondary">Transaction Details</h3>
                  <span className="text-xs text-gray-400 font-mono">ID: {selectedTxn.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedTxn(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-secondary transition-all"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Guest Name</label>
                    <p className="text-sm font-semibold text-secondary mt-0.5">{selectedTxn.guest_name}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Transaction Ref</label>
                    <p className="text-sm font-semibold font-mono text-secondary mt-0.5">{selectedTxn.reference}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Category</label>
                    <p className="text-sm font-semibold text-secondary mt-0.5">{selectedTxn.category}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Payment Method</label>
                    <p className="text-sm font-semibold text-secondary mt-0.5">{selectedTxn.method}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Transaction ID</label>
                    <p className="text-sm font-bold text-secondary mt-0.5">{selectedTxn.transaction_id}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Date / Time</label>
                    <p className="text-sm font-semibold text-secondary mt-0.5">{format(new Date(selectedTxn.date), 'yyyy-MM-dd HH:mm:ss')}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Amount Due</label>
                    <p className="text-2xl font-black text-secondary mt-0.5">GH₵{selectedTxn.amount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Status</label>
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(selectedTxn.status)}`}>
                      {getStatusIcon(selectedTxn.status)}
                      {selectedTxn.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                <button 
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-xl text-xs hover:bg-gray-100 transition-all flex items-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Receipt
                </button>
                {selectedTxn.status === 'Pending' && (
                  <button 
                    onClick={() => {
                      handleMarkAsPaid(selectedTxn.id);
                      setSelectedTxn(null);
                    }}
                    className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/95 transition-all shadow-md shadow-primary/10 flex items-center gap-1.5"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Settle Account
                  </button>
                )}
                <button 
                  onClick={() => setSelectedTxn(null)}
                  className="px-4 py-2 bg-secondary text-white font-bold rounded-xl text-xs hover:bg-secondary/95 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
};

export default FinancePage;
