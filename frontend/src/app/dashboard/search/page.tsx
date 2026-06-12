'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { 
  Search, 
  Users, 
  Briefcase, 
  BedDouble, 
  CalendarCheck, 
  CreditCard, 
  Box, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const SearchResultsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>({
    guests: [],
    staff: [],
    rooms: [],
    bookings: [],
    reservations: [],
    payments: [],
    inventory: []
  });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const response = await api.get(`/dashboard/search?q=${encodeURIComponent(query)}`);
        setResults(response.data.data);
      } catch (error) {
        console.error('Failed to perform global search:', error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  const tabs = [
    { id: 'all', label: 'All Results' },
    { id: 'guests', label: 'Guests', icon: Users, count: results.guests?.length || 0 },
    { id: 'staff', label: 'Staff', icon: Briefcase, count: results.staff?.length || 0 },
    { id: 'rooms', label: 'Rooms', icon: BedDouble, count: results.rooms?.length || 0 },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, count: results.bookings?.length || 0 },
    { id: 'reservations', label: 'Reservations', icon: CalendarCheck, count: results.reservations?.length || 0 },
    { id: 'payments', label: 'Payments', icon: CreditCard, count: results.payments?.length || 0 },
    { id: 'inventory', label: 'Inventory', icon: Box, count: results.inventory?.length || 0 },
  ];

  const renderGuests = (data: any[]) => (
    <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm">
      <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" /> Guests ({data.length})
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">No guests found matching "{query}"</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {data.map((guest: any) => (
            <div key={guest.id} className="py-4 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-xl transition-all">
              <div>
                <p className="font-bold text-secondary">{guest.full_name}</p>
                <p className="text-xs text-gray-500">{guest.email} | {guest.phone}</p>
              </div>
              <button 
                onClick={() => router.push(`/dashboard/guests?search=${encodeURIComponent(guest.full_name)}`)}
                className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View in Guests <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStaff = (data: any[]) => (
    <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm">
      <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" /> Staff ({data.length})
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">No staff found matching "{query}"</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {data.map((member: any) => (
            <div key={member.id} className="py-4 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-xl transition-all">
              <div>
                <p className="font-bold text-secondary">{member.name}</p>
                <p className="text-xs text-gray-500">{member.position} | {member.department} | GH₵{member.salary}</p>
              </div>
              <button 
                onClick={() => router.push(`/dashboard/staff?search=${encodeURIComponent(member.name)}`)}
                className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View in Staff <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRooms = (data: any[]) => (
    <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm">
      <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
        <BedDouble className="h-5 w-5 text-primary" /> Rooms ({data.length})
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">No rooms found matching "{query}"</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((room: any) => (
            <div key={room.id} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center hover:shadow-sm transition-all bg-gray-50/20">
              <div>
                <p className="font-bold text-secondary">Room {room.room_number}</p>
                <p className="text-xs text-gray-500">{room.type_name} - Floor {room.floor}</p>
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 uppercase ${
                  room.status === 'Available' ? 'bg-green-50 text-green-600' :
                  room.status === 'Occupied' ? 'bg-blue-50 text-blue-600' :
                  room.status === 'Reserved' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {room.status}
                </span>
              </div>
              <button 
                onClick={() => router.push(`/dashboard/rooms?search=${encodeURIComponent(room.room_number)}`)}
                className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Manage <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBookings = (data: any[]) => (
    <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm">
      <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
        <CalendarCheck className="h-5 w-5 text-primary" /> Bookings ({data.length})
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">No bookings found matching "{query}"</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {data.map((booking: any) => (
            <div key={booking.id} className="py-4 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-xl transition-all">
              <div>
                <p className="font-bold text-secondary">{booking.guest_name} - Room {booking.room_number}</p>
                <p className="text-xs text-gray-500">{booking.check_in} to {booking.check_out} | GH₵{booking.total_price}</p>
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase ${
                  booking.status === 'Confirmed' || booking.status === 'Checked In' ? 'bg-green-50 text-green-600' :
                  booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                }`}>
                  {booking.status}
                </span>
              </div>
              <button 
                onClick={() => router.push(`/dashboard/bookings?search=${encodeURIComponent(booking.guest_name)}`)}
                className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderReservations = (data: any[]) => (
    <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm">
      <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
        <CalendarCheck className="h-5 w-5 text-primary" /> Reservations ({data.length})
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">No reservations found matching "{query}"</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {data.map((res: any) => (
            <div key={res.id} className="py-4 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-xl transition-all">
              <div>
                <p className="font-bold text-secondary">{res.guest_name} - Room {res.room_number}</p>
                <p className="text-xs text-gray-500">{res.check_in} to {res.check_out} | {res.status}</p>
              </div>
              <button 
                onClick={() => router.push(`/dashboard/reservations?search=${encodeURIComponent(res.guest_name)}`)}
                className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPayments = (data: any[]) => (
    <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm">
      <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-primary" /> Payments ({data.length})
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">No payments found matching "{query}"</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {data.map((payment: any) => (
            <div key={payment.id} className="py-4 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-xl transition-all">
              <div>
                <p className="font-bold text-secondary">Transaction: {payment.transaction_id || `ID: #${payment.id}`}</p>
                <p className="text-xs text-gray-500">Guest: {payment.guest_name} | GH₵{payment.amount} | {payment.method}</p>
                <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase ${
                  payment.status === 'Paid' ? 'bg-green-50 text-green-600' :
                  payment.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                }`}>
                  {payment.status}
                </span>
              </div>
              <button 
                onClick={() => router.push(`/dashboard/payments?search=${encodeURIComponent(payment.guest_name)}`)}
                className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInventory = (data: any[]) => (
    <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm">
      <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
        <Box className="h-5 w-5 text-primary" /> Inventory ({data.length})
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">No inventory items found matching "{query}"</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {data.map((item: any) => (
            <div key={item.id} className="py-4 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-xl transition-all">
              <div>
                <p className="font-bold text-secondary">{item.item_name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} {item.unit} | Min Stock: {item.min_stock} {item.unit}</p>
                {item.quantity < item.min_stock && (
                  <span className="inline-block text-[8px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full mt-1 uppercase">
                    Low Stock
                  </span>
                )}
              </div>
              <button 
                onClick={() => router.push(`/dashboard/inventory?search=${encodeURIComponent(item.item_name)}`)}
                className="text-xs text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View in Inventory <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2 flex items-center gap-3">
          <Search className="h-8 w-8 text-primary" /> Search Results
        </h1>
        <p className="text-gray-500 text-sm">
          Showing results for query: <span className="font-bold text-secondary">"{query}"</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] shadow-sm border border-gray-50">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-gray-400 font-semibold">Searching database...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {(activeTab === 'all' || activeTab === 'guests') && renderGuests(results.guests || [])}
          {(activeTab === 'all' || activeTab === 'staff') && renderStaff(results.staff || [])}
          {(activeTab === 'all' || activeTab === 'rooms') && renderRooms(results.rooms || [])}
          {(activeTab === 'all' || activeTab === 'bookings') && renderBookings(results.bookings || [])}
          {(activeTab === 'all' || activeTab === 'reservations') && renderReservations(results.reservations || [])}
          {(activeTab === 'all' || activeTab === 'payments') && renderPayments(results.payments || [])}
          {(activeTab === 'all' || activeTab === 'inventory') && renderInventory(results.inventory || [])}
        </div>
      )}
    </DashboardLayout>
  );
};

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px]">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
