'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Utensils, 
  Sparkles, 
  HelpCircle, 
  Clock, 
  DollarSign, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  UserCircle,
  LogOut,
  Loader2,
  Phone,
  Globe,
  Lock,
  PlusCircle,
  Edit2,
  Check,
  CreditCard,
  Hash
} from 'lucide-react';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';
import { useSiteSettings } from '@/lib/siteSettings';
import Link from 'next/link';

export default function GuestPortal() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const settings = useSiteSettings();
  const router = useRouter();

  // Data States
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [foodOrders, setFoodOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rooms' | 'services' | 'food'>('rooms');

  // Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [guestProfile, setGuestProfile] = useState<any>({
    full_name: '',
    email: '',
    phone: '',
    nationality: '',
    id_type: 'Passport',
    id_number: ''
  });

  // Payment Modal States
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<{ type: 'room' | 'service' | 'food'; id: number; amount: number } | null>(null);
  const [selectedPayMethod, setSelectedPayMethod] = useState<'Mobile Money' | 'Visa Card' | 'Mastercard'>('Mobile Money');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Room Bookings
      const bookingsRes = await api.get('/bookings/my-bookings');
      setBookings(bookingsRes.data?.data || bookingsRes.data || []);
      
      // 2. Fetch Service Bookings
      const servicesRes = await api.get('/service-bookings/my');
      setServices(servicesRes.data?.data || servicesRes.data || []);

      // 3. Fetch Food Orders
      const foodRes = await api.get('/food-orders/my');
      setFoodOrders(foodRes.data?.data || foodRes.data || []);

      // 4. Fetch Guest Profile
      const profileRes = await api.get('/guests/profile/me');
      if (profileRes.data?.success && profileRes.data.data) {
        setGuestProfile(profileRes.data.data);
      } else {
        setGuestProfile({
          full_name: user?.name || '',
          email: user?.email || '',
          phone: '',
          nationality: '',
          id_type: 'Passport',
          id_number: ''
        });
      }

    } catch (error) {
      console.error('Failed to load guest portal data:', error);
      toast.error('Failed to load some activity logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, router]);

  const handleCancelBooking = async (id: number, type: 'room' | 'service' | 'food') => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      if (type === 'room') {
        await api.post(`/bookings/${id}/cancel`);
      } else if (type === 'service') {
        await api.post(`/service-bookings/${id}/cancel`);
      } else if (type === 'food') {
        await api.post(`/food-orders/${id}/cancel`);
      }
      toast.success('Cancelled successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel. It may have already been processed.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await api.put('/guests/profile/me', guestProfile);
      if (res.data.success) {
        toast.success('Guest profile updated successfully!');
        setIsEditingProfile(false);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleOpenPayment = (type: 'room' | 'service' | 'food', id: number, amount: number) => {
    setPaymentTarget({ type, id, amount });
    setPaymentNumber('');
    setIsPayModalOpen(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentNumber) {
      toast.error('Please enter payment details');
      return;
    }

    setProcessingPayment(true);
    try {
      const res = await api.post('/payments/complete', {
        source: paymentTarget?.type === 'room' ? 'booking' : paymentTarget?.type,
        id: paymentTarget?.id,
        method: selectedPayMethod
      });

      if (res.data.success) {
        toast.success('Payment completed successfully!');
        setIsPayModalOpen(false);
        setPaymentTarget(null);
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment processing failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusBadge = (status: string, paymentStatus?: string) => {
    const s = status.toLowerCase();
    const ps = paymentStatus?.toLowerCase();

    // Custom statuses as requested
    if (s === 'pending' && ps === 'pending') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-yellow-55 text-yellow-700 border border-yellow-200 uppercase"><Clock className="h-3 w-3" /> Pending Payment</span>;
    }
    if (s === 'pending') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-600 border border-yellow-100 uppercase"><Clock className="h-3 w-3" /> Reserved</span>;
    }
    if (s === 'confirmed' || ps === 'paid') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-green-55 text-green-700 border border-green-200 uppercase"><CheckCircle className="h-3 w-3" /> Confirmed</span>;
    }
    if (s === 'checked in') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase"><UserCircle className="h-3 w-3" /> Checked In</span>;
    }
    if (s === 'checked out' || s === 'completed') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-gray-50 text-gray-600 border border-gray-150 uppercase"><CheckCircle className="h-3 w-3" /> Completed</span>;
    }
    if (s === 'cancelled' || s === 'failed') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 uppercase"><XCircle className="h-3 w-3" /> Cancelled</span>;
    }
    return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-secondary text-secondary-foreground border border-gray-100 uppercase">{status}</span>;
  };

  if (!isAuthenticated) return null;

  // Pending Actions lists
  const pendingRoomPayments = bookings.filter(b => b.status === 'Pending' || b.payment_status === 'Pending');
  const pendingServicePayments = services.filter(s => s.payment_status === 'Pending' && s.status !== 'Cancelled');
  const pendingFoodPayments = foodOrders.filter(f => f.payment_status === 'Pending' && f.status !== 'Cancelled');
  const totalPendingActions = pendingRoomPayments.length + pendingServicePayments.length + pendingFoodPayments.length;

  return (
    <main className="bg-[#F8F9FA] min-h-screen font-sans">
      <Toaster position="top-center" richColors />
      <Navbar />

      {/* Header Banner */}
      <section className="bg-premium-gradient text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-gold-gradient font-bold tracking-widest uppercase text-xs mb-2 block">
              Guest Portal Dashboard
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Welcome back, <span className="text-gold-gradient">{user?.name}</span>
            </h1>
            <p className="text-white/60 text-sm">
              Manage your current reservations, bookings, and requested hotel activities.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* User Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[32px] shadow-premium border border-gray-100 flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-accent rounded-3xl flex items-center justify-center text-primary mb-4 border border-primary/20 shadow-inner">
                <User className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-secondary text-lg mb-1">{user?.name}</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-6">{user?.role}</p>
              
              <div className="w-full h-[1px] bg-gray-100 my-2" />
              
              {/* Profile View / Form */}
              {!isEditingProfile ? (
                <div className="w-full text-left space-y-4 pt-2">
                  <div>
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email Address</span>
                    <span className="text-sm font-semibold text-secondary break-all">{guestProfile.email}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Contact Phone</span>
                    <span className="text-sm font-semibold text-secondary">{guestProfile.phone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Nationality</span>
                    <span className="text-sm font-semibold text-secondary">{guestProfile.nationality || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID Type & Number</span>
                    <span className="text-sm font-semibold text-secondary">
                      {guestProfile.id_number ? `${guestProfile.id_type}: ${guestProfile.id_number}` : 'Not provided'}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="w-full mt-4 py-2.5 border border-primary/20 hover:border-primary text-primary rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit Profile Details
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="w-full text-left space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={guestProfile.full_name} 
                      onChange={(e) => setGuestProfile({ ...guestProfile, full_name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={guestProfile.phone} 
                      onChange={(e) => setGuestProfile({ ...guestProfile, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Nationality</label>
                    <input 
                      type="text" 
                      required
                      value={guestProfile.nationality} 
                      onChange={(e) => setGuestProfile({ ...guestProfile, nationality: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID Type</label>
                      <select 
                        value={guestProfile.id_type} 
                        onChange={(e) => setGuestProfile({ ...guestProfile, id_type: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs font-semibold"
                      >
                        <option value="Passport">Passport</option>
                        <option value="Driver License">Driver's Lic.</option>
                        <option value="National ID">National ID</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID Number</label>
                      <input 
                        type="text" 
                        required
                        value={guestProfile.id_number} 
                        onChange={(e) => setGuestProfile({ ...guestProfile, id_number: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-lg text-xs" 
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-secondary rounded-lg text-xs font-bold text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="flex-1 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1"
                    >
                      {profileLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Check className="h-3 w-3" /> Save</>}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Pending Actions Alert Card */}
            {totalPendingActions > 0 && (
              <div className="bg-yellow-50/50 border border-yellow-200/60 p-6 rounded-[32px] shadow-sm space-y-4">
                <h4 className="font-bold text-yellow-800 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" /> Pending Bills ({totalPendingActions})
                </h4>
                <div className="space-y-2.5 text-xs text-yellow-900 font-medium">
                  {pendingRoomPayments.map(b => (
                    <div key={`pending-room-${b.id}`} className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-yellow-200/40">
                      <span className="font-semibold text-secondary">Room {b.room_number} Booking</span>
                      <button 
                        onClick={() => handleOpenPayment('room', b.id, b.total_price)}
                        className="px-2.5 py-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg text-[10px]"
                      >
                        Pay GH₵{b.total_price}
                      </button>
                    </div>
                  ))}
                  {pendingServicePayments.map(s => (
                    <div key={`pending-srv-${s.id}`} className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-yellow-200/40">
                      <span className="font-semibold text-secondary">{s.service_name}</span>
                      <button 
                        onClick={() => handleOpenPayment('service', s.id, s.price)}
                        className="px-2.5 py-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg text-[10px]"
                      >
                        Pay GH₵{s.price}
                      </button>
                    </div>
                  ))}
                  {pendingFoodPayments.map(f => (
                    <div key={`pending-food-${f.id}`} className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-yellow-200/40">
                      <span className="font-semibold text-secondary">Food Order #{f.id}</span>
                      <button 
                        onClick={() => handleOpenPayment('food', f.id, f.total_price)}
                        className="px-2.5 py-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg text-[10px]"
                      >
                        Pay GH₵{f.total_price}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Navigation Links */}
            <div className="bg-white p-6 rounded-[32px] shadow-premium border border-gray-100 space-y-4">
              <h4 className="font-bold text-secondary text-sm">Quick Actions</h4>
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/"
                  className="w-full text-left py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-secondary rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span>Go to Homepage</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </Link>
                <Link
                  href="/rooms"
                  className="w-full text-left py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-secondary rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span>Book New Room</span>
                  <PlusCircle className="h-3.5 w-3.5 text-gray-400" />
                </Link>
                <Link
                  href="/restaurant"
                  className="w-full text-left py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-secondary rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span>Order Dining / Food</span>
                  <Utensils className="h-3.5 w-3.5 text-gray-400" />
                </Link>
                <Link
                  href="/services"
                  className="w-full text-left py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-secondary rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span>Schedule Spa & Leisure</span>
                  <Sparkles className="h-3.5 w-3.5 text-gray-400" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full text-left py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-secondary rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span>Contact Hotel Support</span>
                  <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                </Link>
              </div>
            </div>

          </div>

          {/* Activity Logs & Tabs */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Tab selection */}
            <div className="bg-white p-3 rounded-[24px] shadow-premium border border-gray-100 flex gap-2 w-full md:w-fit">
              <button
                onClick={() => setActiveTab('rooms')}
                className={`flex-1 md:flex-initial px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'rooms' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-4 w-4" /> Room Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`flex-1 md:flex-initial px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'services' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Sparkles className="h-4 w-4" /> Services ({services.length})
              </button>
              <button
                onClick={() => setActiveTab('food')}
                className={`flex-1 md:flex-initial px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'food' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Utensils className="h-4 w-4" /> Food Orders ({foodOrders.length})
              </button>
            </div>

            {/* Content Lists */}
            {loading ? (
              <div className="bg-white p-12 rounded-[40px] shadow-premium border border-gray-100 flex justify-center items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Rooms Bookings List */}
                {activeTab === 'rooms' && (
                  bookings.length === 0 ? (
                    <div className="bg-white p-12 rounded-[40px] text-center shadow-premium border border-gray-100">
                      <p className="text-lg font-bold text-secondary mb-2">No Room Bookings Found</p>
                      <p className="text-gray-500 text-sm mb-6">You haven't booked any rooms yet.</p>
                      <Link href="/rooms" className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-primary/95 transition-all inline-block">Book Room Now</Link>
                    </div>
                  ) : (
                    bookings.map((b) => (
                      <div key={b.id} className="bg-white p-8 rounded-[32px] shadow-premium border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md card-hover">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="text-xl font-bold text-secondary font-sans">Room {b.room_number} <span className="text-sm font-medium text-gray-400">({b.room_type})</span></h4>
                            {getStatusBadge(b.status, b.payment_status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-sm text-gray-500">
                            <div>
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Check-In</span>
                              <span className="font-semibold text-secondary">{b.check_in}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Check-Out</span>
                              <span className="font-semibold text-secondary">{b.check_out}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Guests</span>
                              <span className="font-semibold text-secondary">{b.guests_count} Guests</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Price</span>
                              <span className="font-bold text-primary">GH₵{b.total_price}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                          {b.payment_status === 'Pending' && b.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleOpenPayment('room', b.id, b.total_price)}
                              className="w-full md:w-auto px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer text-center shadow-lg shadow-primary/10 flex items-center justify-center gap-1.5"
                            >
                              <CreditCard className="h-3.5 w-3.5" /> Pay Now
                            </button>
                          )}
                          {b.status === 'Pending' && (
                            <button
                              onClick={() => handleCancelBooking(b.id, 'room')}
                              className="w-full md:w-auto px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl text-xs font-bold transition-all cursor-pointer text-center"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )
                )}

                {/* Services Appointments List */}
                {activeTab === 'services' && (
                  services.length === 0 ? (
                    <div className="bg-white p-12 rounded-[40px] text-center shadow-premium border border-gray-100">
                      <p className="text-lg font-bold text-secondary mb-2">No Service Bookings Found</p>
                      <p className="text-gray-500 text-sm mb-6">You haven't scheduled any services (spa, sports, gym, event space) yet.</p>
                      <Link href="/services" className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-primary/95 transition-all inline-block">Book Service Now</Link>
                    </div>
                  ) : (
                    services.map((s) => (
                      <div key={s.id} className="bg-white p-8 rounded-[32px] shadow-premium border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md card-hover">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-xl font-bold text-secondary">{s.service_name}</h4>
                            {getStatusBadge(s.status, s.payment_status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 text-sm text-gray-500">
                            <div>
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
                              <span className="font-semibold text-secondary">{s.booking_date}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Time</span>
                              <span className="font-semibold text-secondary">{s.booking_time}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Cost</span>
                              <span className="font-bold text-primary">GH₵{s.price}</span>
                            </div>
                            {s.transaction_id && (
                              <div>
                                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Transaction Ref</span>
                                <span className="font-semibold text-secondary break-all">{s.transaction_id}</span>
                              </div>
                            )}
                            {s.notes && (
                              <div className="col-span-2 md:col-span-4 mt-1">
                                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Special Instructions</span>
                                <span className="text-xs text-gray-600 leading-relaxed">{s.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 text-center">
                          {s.payment_status === 'Pending' && s.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleOpenPayment('service', s.id, s.price)}
                              className="w-full md:w-auto px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer text-center shadow-lg shadow-primary/10 flex items-center justify-center gap-1.5"
                            >
                              <CreditCard className="h-3.5 w-3.5" /> Pay Now
                            </button>
                          )}
                          {s.status === 'Pending' && (
                            <button
                              onClick={() => handleCancelBooking(s.id, 'service')}
                              className="w-full md:w-auto px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl text-xs font-bold transition-all cursor-pointer text-center"
                            >
                              Cancel Request
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )
                )}

                {/* Food Orders List */}
                {activeTab === 'food' && (
                  foodOrders.length === 0 ? (
                    <div className="bg-white p-12 rounded-[40px] text-center shadow-premium border border-gray-100">
                      <p className="text-lg font-bold text-secondary mb-2">No Food Orders Found</p>
                      <p className="text-gray-500 text-sm mb-6">You haven't ordered any food yet.</p>
                      <Link href="/restaurant" className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-primary/95 transition-all inline-block">Order Food Now</Link>
                    </div>
                  ) : (
                    foodOrders.map((f) => (
                      <div key={f.id} className="bg-white p-8 rounded-[32px] shadow-premium border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md card-hover">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-xl font-bold text-secondary">Order #{f.id}</h4>
                            {getStatusBadge(f.status, f.payment_status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 text-sm text-gray-500">
                            <div className="col-span-2">
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Items Ordered</span>
                              <span className="font-semibold text-secondary">{f.items}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Delivery To</span>
                              <span className="font-semibold text-secondary">{f.delivery_room || f.delivery_location || 'Restaurant'}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Price</span>
                              <span className="font-bold text-primary">GH₵{f.total_price}</span>
                            </div>
                            {f.transaction_id && (
                              <div className="col-span-2">
                                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID</span>
                                <span className="font-semibold text-secondary break-all text-xs">{f.transaction_id}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                          {f.payment_status === 'Pending' && f.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleOpenPayment('food', f.id, f.total_price)}
                              className="w-full md:w-auto px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer text-center shadow-lg shadow-primary/10 flex items-center justify-center gap-1.5"
                            >
                              <CreditCard className="h-3.5 w-3.5" /> Pay Now
                            </button>
                          )}
                          {f.status === 'Pending' && (
                            <button
                              onClick={() => handleCancelBooking(f.id, 'food')}
                              className="w-full md:w-auto px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl text-xs font-bold transition-all cursor-pointer text-center"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Payment Processing Modal */}
      {isPayModalOpen && paymentTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16 blur-2xl" />

            <h3 className="text-2xl font-bold text-secondary mb-2">Complete Payment</h3>
            <p className="text-gray-500 text-xs mb-6">Complete billing for your outstanding hotel booking.</p>

            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="p-4 bg-accent/30 rounded-2xl border border-primary/5 text-secondary text-sm space-y-1.5 font-sans">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Billing Source</span>
                  <span className="capitalize font-semibold text-secondary">{paymentTarget.type} payment</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Reference ID</span>
                  <span className="font-semibold text-secondary">#{paymentTarget.id}</span>
                </div>
                <div className="w-full h-[1px] bg-gray-200 my-1" />
                <div className="flex justify-between font-bold">
                  <span>Total Bill</span>
                  <span className="text-primary font-bold">GH₵{paymentTarget.amount}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Payment Option</label>
                <div className="flex gap-2 font-sans">
                  {(['Mobile Money', 'Visa Card', 'Mastercard'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedPayMethod(m)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold tracking-wider transition-all border ${
                        selectedPayMethod === m 
                          ? 'bg-secondary text-white border-secondary shadow-sm' 
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {selectedPayMethod === 'Mobile Money' ? 'Mobile Wallet Number' : 'Card details / Number'}
                </label>
                <input 
                  type="text" 
                  required 
                  value={paymentNumber}
                  onChange={(e) => setPaymentNumber(e.target.value)}
                  placeholder={selectedPayMethod === 'Mobile Money' ? 'e.g. 024XXXXXX' : 'Card number (16 digits)'}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-secondary rounded-2xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingPayment}
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/15 transition-all flex items-center gap-2"
                >
                  {processingPayment ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Pay Bill <Check className="h-4 w-4" /></>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Footer />
    </main>
  );
}