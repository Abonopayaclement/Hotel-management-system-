'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  BedDouble,
  Circle
} from 'lucide-react';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';

const RoomsPage = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    room_number: '',
    floor: '',
    type_id: '',
    status: 'Available',
    price_per_night: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await api.get('/rooms/types');
      setRoomTypes(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch room types');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'text-green-500 bg-green-50';
      case 'Occupied': return 'text-blue-500 bg-blue-50';
      case 'Reserved': return 'text-purple-500 bg-purple-50';
      case 'Cleaning': return 'text-yellow-500 bg-yellow-50';
      case 'Maintenance': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      room_number: '',
      floor: '',
      type_id: '',
      status: 'Available',
      price_per_night: ''
    });
    setEditingRoomId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (room: any) => {
    setModalMode('edit');
    setEditingRoomId(room.id);
    setFormData({
      room_number: room.room_number,
      floor: room.floor.toString(),
      type_id: room.type_id.toString(),
      status: room.status,
      price_per_night: room.price_per_night.toString()
    });
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      toast.success('Room deleted successfully');
      fetchRooms();
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modalMode === 'add') {
        await api.post('/rooms', {
          room_number: formData.room_number,
          floor: parseInt(formData.floor),
          type_id: parseInt(formData.type_id),
          status: formData.status
        });
        toast.success('Room added successfully');
      } else {
        await api.put(`/rooms/${editingRoomId}`, {
          room_number: formData.room_number,
          floor: parseInt(formData.floor),
          type_id: parseInt(formData.type_id),
          status: formData.status,
          price_per_night: parseFloat(formData.price_per_night)
        });
        toast.success('Room updated successfully');
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save room details');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = 
      room.room_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
      room.type_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Room Management</h1>
          <p className="text-gray-500 text-sm">Manage your hotel rooms, types, and real-time status.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Room
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search room number or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="flex gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 bg-gray-50 text-gray-500 rounded-2xl text-sm font-bold border-none focus:ring-0 cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Reserved">Reserved</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Room Info</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Type</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Floor</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-8 py-6 bg-gray-50/20" />
                </tr>
              ))
            ) : filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-gray-400 font-semibold">
                  No rooms match the filters.
                </td>
              </tr>
            ) : (
              filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <BedDouble className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-secondary">Room {room.room_number}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-semibold text-gray-600">{room.type_name}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-medium">Floor {room.floor}</td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-secondary">GH₵{room.price_per_night}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(room.status)}`}>
                      <Circle className="h-2 w-2 fill-current" />
                      {room.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(room)}
                        className="p-2 hover:bg-gray-150 rounded-lg text-gray-400 hover:text-primary transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRoom(room.id)}
                        className="p-2 hover:bg-gray-150 rounded-lg text-gray-400 hover:text-danger transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-secondary mb-6">
              {modalMode === 'add' ? 'Add New Room' : 'Edit Room'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Room Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 101"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Floor</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 1"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-0"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Room Type</label>
                <select
                  required
                  value={formData.type_id}
                  onChange={(e) => {
                    const selectedType = roomTypes.find((t: any) => t.id === parseInt(e.target.value));
                    setFormData({ 
                      ...formData, 
                      type_id: e.target.value, 
                      price_per_night: selectedType ? selectedType.price_per_night.toString() : '' 
                    });
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-0"
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map((type: any) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Price Per Night (GH₵)</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  placeholder="e.g. 250"
                  value={formData.price_per_night}
                  onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-250 text-gray-600 rounded-xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/10 transition-all"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RoomsPage;
