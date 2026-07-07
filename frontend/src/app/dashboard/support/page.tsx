'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  Phone,
  Mail,
  Home,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';

const SupportDashboardPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/support-requests');
      setRequests(res.data?.data || res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch support requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, currentStatus: string) => {
    let nextStatus = 'In Progress';
    if (currentStatus === 'In Progress') nextStatus = 'Resolved';
    if (currentStatus === 'Resolved') nextStatus = 'Pending';

    try {
      await api.put(`/support-requests/${id}/status`, { status: nextStatus });
      toast.success(`Request status updated to ${nextStatus}`);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: nextStatus } : r));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    const u = urgency.toLowerCase();
    if (u === 'high') {
      return <span className="px-2.5 py-1 text-xs font-bold bg-red-50 text-red-600 rounded-full uppercase tracking-wider">High</span>;
    }
    if (u === 'medium') {
      return <span className="px-2.5 py-1 text-xs font-bold bg-yellow-50 text-yellow-600 rounded-full uppercase tracking-wider">Medium</span>;
    }
    return <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-600 rounded-full uppercase tracking-wider">Low</span>;
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'resolved') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 uppercase"><CheckCircle className="h-3 w-3" /> Resolved</span>;
    }
    if (s === 'in progress') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-600 uppercase"><Clock className="h-3 w-3" /> In Progress</span>;
    }
    return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 uppercase"><Clock className="h-3 w-3" /> Pending</span>;
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2 flex items-center gap-3">
            <Wrench className="h-8 w-8 text-primary" /> Support & Maintenance Tickets
          </h1>
          <p className="text-gray-500 text-sm">Monitor and resolve guest requests, cleaning tasks, and maintenance issues.</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-16 rounded-[40px] shadow-sm border border-gray-50 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-16 rounded-[40px] text-center shadow-sm border border-gray-50">
          <p className="text-xl font-bold text-secondary mb-2">No Support Tickets Found</p>
          <p className="text-gray-500 text-sm">All rooms are currently in perfect order.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {requests.map((req) => (
            <div key={req.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all card-hover">
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase block mb-1">{req.category}</span>
                    <h3 className="text-xl font-bold text-secondary flex items-center gap-2">
                      <Home className="h-5 w-5 text-gray-400" /> {req.room_number || 'No Room'}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    {getUrgencyBadge(req.urgency)}
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-6 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">{req.description}</p>

                {/* Contact info */}
                <div className="space-y-2 text-xs text-gray-500 mb-8">
                  <p className="flex items-center gap-2"><User className="h-4 w-4 text-gray-400" /> Guest: <span className="font-bold text-secondary">{req.guest_name}</span></p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> Phone: <span className="font-bold text-secondary">{req.phone}</span></p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> Email: <span className="font-bold text-secondary">{req.email}</span></p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(req.created_at).toLocaleString()}</span>
                <button
                  onClick={() => handleUpdateStatus(req.id, req.status)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold shadow-sm transition-all cursor-pointer ${
                    req.status === 'Resolved' 
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                      : req.status === 'In Progress' 
                      ? 'bg-success text-white hover:bg-success/95' 
                      : 'bg-primary text-white hover:bg-primary/95'
                  }`}
                >
                  {req.status === 'Pending' ? 'Start Resolution' : req.status === 'In Progress' ? 'Mark Resolved' : 'Re-open Ticket'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SupportDashboardPage;
