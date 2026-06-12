'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Package, 
  Search,
  MoreHorizontal,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';

const InventoryPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInventory();
  }, [searchQuery]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      const response = await api.get('/inventory', { params });
      setItems(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (stock: number, minStock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < minStock) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-50 text-green-600';
      case 'Low Stock': return 'bg-orange-50 text-orange-600';
      case 'Out of Stock': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  const lowStockCount = items.filter(item => item.quantity > 0 && item.quantity < item.min_stock).length;
  const outOfStockCount = items.filter(item => item.quantity === 0).length;

  const stats = [
    { label: 'Total Items', value: items.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Low Stock Alerts', value: lowStockCount, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Out of Stock', value: outOfStockCount, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Inventory Management</h1>
          <p className="text-gray-500 text-sm">Track supplies, monitor stock levels and manage procurement.</p>
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
            placeholder="Search inventory items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[40px] border border-gray-50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Item Name</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock Level</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 font-bold uppercase">Min Stock</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-8" />
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-gray-400 font-semibold">
                      No inventory items found.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const status = getStatus(item.quantity, item.min_stock);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div>
                            <p className="font-bold text-secondary">{item.item_name}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">ID: INV00{item.id}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 max-w-[100px] h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${item.quantity < item.min_stock ? 'bg-orange-500' : 'bg-primary'}`} 
                                style={{ width: `${Math.min((item.quantity / (item.min_stock * 2)) * 100, 100)}%` }}
                              />
                            </div>
                            <p className="text-sm font-bold text-secondary">
                              {item.quantity} <span className="text-[10px] text-gray-400 font-normal">{item.unit}</span>
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-500 font-semibold">
                          {item.min_stock} {item.unit}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InventoryPage;
