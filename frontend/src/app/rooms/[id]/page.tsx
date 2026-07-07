'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  BedDouble,
  Maximize,
  Star,
  ChevronLeft,
  Wifi,
  Tv,
  Wind,
  Bath,
  Coffee,
  Wine,
  Sofa,
  Lock,
  Droplets,
  Bell,
  Check,
  ArrowRight,
  Sparkles,
  Calendar,
  Phone,
  FileText,
  Globe,
  CreditCard,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast, Toaster } from 'sonner';

const getRoomImage = (typeName: string) => {
  if (!typeName) return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
  const name = typeName.toLowerCase();
  if (name.includes('single')) {
    return 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80';
  } else if (name.includes('double')) {
    return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
  } else if (name.includes('deluxe')) {
    return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80';
  } else if (name.includes('executive')) {
    return 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80';
  } else if (name.includes('presidential')) {
    return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80';
  } else if (name.includes('duplex') || name.includes('family')) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
};

const getAmenityIcon = (label: string) => {
  if (!label) return Sparkles;
  const normalized = label.toLowerCase();
  if (normalized.includes('wifi') || normalized.includes('internet')) return Wifi;
  if (normalized.includes('ac') || normalized.includes('air conditioning')) return Wind;
  if (normalized.includes('tv') || normalized.includes('television')) return Tv;
  if (normalized.includes('mini bar') || normalized.includes('wine')) return Wine;
  if (normalized.includes('bathtub') || normalized.includes('bathroom') || normalized.includes('bath')) return Bath;
  if (normalized.includes('balcony') || normalized.includes('terrace') || normalized.includes('sofa')) return Sofa;
  if (normalized.includes('room service')) return Bell;
  if (normalized.includes('coffee') || normalized.includes('tea')) return Coffee;
  if (normalized.includes('hot water') || normalized.includes('jacuzzi') || normalized.includes('pool') || normalized.includes('water')) return Droplets;
  if (normalized.includes('safe') || normalized.includes('lock')) return Lock;
  return Sparkles;
};

const getRoomTypeFeatures = (typeName: string) => {
  if (!typeName) {
    return {
      size: '50m²',
      bed: 'King Bed',
      view: 'City View',
      features: ['Premium comfort and style', 'High-speed internet', '24/7 room service']
    };
  }
  const name = typeName.toLowerCase();
  if (name.includes('single')) {
    return {
      size: '25m²',
      bed: 'Single Bed',
      view: 'Courtyard View',
      features: ['Perfect for solo travelers', 'Work desk with ergonomic chair', 'Compact modern bathroom']
    };
  } else if (name.includes('double')) {
    return {
      size: '45m²',
      bed: 'Double Bed',
      view: 'City View',
      features: ['Spacious comfort for couples', 'Cozy seating area', 'Modern en-suite bathroom']
    };
  } else if (name.includes('deluxe')) {
    return {
      size: '60m²',
      bed: 'King Bed',
      view: 'Ocean/City View',
      features: ['Elegant design with premium layout', 'Luxurious bathtub', 'Private balcony access']
    };
  } else if (name.includes('executive')) {
    return {
      size: '85m²',
      bed: 'Super King Bed',
      view: 'Panoramic City View',
      features: ['Executive Lounge access & benefits', 'Separate working and living space', 'Premium espresso machine']
    };
  } else if (name.includes('presidential')) {
    return {
      size: '150m²',
      bed: '2 Super King Beds',
      view: '360° Skyline View',
      features: ['Ultimate VIP luxury experience', 'Private jacuzzi & steam room', 'Personal butler service on demand']
    };
  } else if (name.includes('duplex') || name.includes('family')) {
    return {
      size: '180m²',
      bed: '2 King Beds',
      view: 'Penthouse View',
      features: ['Multi-level layout with spiral staircase', 'Private plunge pool', 'Fully equipped kitchenette']
    };
  } else {
    return {
      size: '50m²',
      bed: 'King Bed',
      view: 'City View',
      features: ['Premium comfort and style', 'High-speed internet', '24/7 room service']
    };
  }
};

const RoomDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;
  
  const { isAuthenticated, user } = useAuthStore();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Form State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [idType, setIdType] = useState('Passport');
  const [idNumber, setIdNumber] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/rooms/${roomId}`);
        const data = response.data?.data ?? response.data;
        if (!data) {
          setError('Room not found');
        } else {
          setRoom(data);
        }
      } catch (err: any) {
        console.error('Failed to fetch room:', err);
        setError(err.message || 'Failed to load room details');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please login to reserve or book a room');
      router.push(`/login?redirect=/rooms/${roomId}`);
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleBookRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !phone || !nationality || !idNumber) {
      toast.error('Please fill in all required details');
      return;
    }

    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const nights = Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));

    if (nights <= 0) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    setBookingLoading(true);
    try {
      const total_price = room.price_per_night * nights;
      const res = await api.post('/bookings', {
        room_id: room.id,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guestsCount,
        total_price,
        guest_details: {
          full_name: user?.name,
          email: user?.email,
          phone,
          nationality,
          id_type: idType,
          id_number: idNumber
        }
      });

      if (res.data.success) {
        toast.success('Room booked successfully!');
        setIsBookingModalOpen(false);
        setTimeout(() => {
          router.push('/guest-portal');
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#F8F9FA]">
        <Navbar />
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!room) {
    return (
      <main className="bg-[#F8F9FA]">
        <Navbar />
        <div className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">Room Not Found</h1>
          <Link href="/rooms" className="text-primary hover:underline">Back to Rooms</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-[#F8F9FA]">
      <Toaster position="top-center" richColors />
      <Navbar />

      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2">
          <Link href="/rooms" className="flex items-center gap-1 text-primary hover:text-primary/80 transition-all text-sm font-semibold">
            <ChevronLeft className="h-4 w-4" />
            Rooms
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 text-sm">{room.type_name}</span>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative h-[500px] overflow-hidden">
        <img 
          src={getRoomImage(room.type_name)}
          alt={room.type_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-secondary shadow-lg uppercase">
          {room.status}
        </div>
      </section>

      {/* Room Details */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-[40px] p-12 shadow-premium">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-secondary mb-4">{room.type_name}</h1>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                    ))}
                    <span className="text-gray-500 ml-2">(247 Reviews)</span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-6 mb-12 p-6 bg-accent/30 rounded-3xl">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Capacity</p>
                  <p className="text-xl font-bold text-secondary">{room.capacity} Guests</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Maximize className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Room Size</p>
                  <p className="text-xl font-bold text-secondary">{getRoomTypeFeatures(room.type_name).size}</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <BedDouble className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Bed Type</p>
                  <p className="text-xl font-bold text-secondary">{getRoomTypeFeatures(room.type_name).bed}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-secondary mb-4">About This Room</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {room.description || `Experience ultimate luxury and comfort in our ${room.type_name}. Featuring premium amenities, modern design, and exceptional service, this room is perfect for guests seeking an unforgettable stay.`}
                </p>
                {getRoomTypeFeatures(room.type_name).features && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-secondary mb-3">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      {getRoomTypeFeatures(room.type_name).features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-bold text-secondary mb-8">Room Amenities</h2>
                {(() => {
                  let parsed: string[] = [];
                  try {
                    parsed = typeof room.amenities === 'string' ? JSON.parse(room.amenities) : (room.amenities || []);
                  } catch (e) {
                    parsed = [];
                  }
                  if (!Array.isArray(parsed) || parsed.length === 0) {
                    parsed = ['Free Wi-Fi', 'Air Conditioning', 'Television', 'Safe Box'];
                  }
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {parsed.map((amenityLabel, index) => {
                        const IconComponent = getAmenityIcon(amenityLabel);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-accent/50 to-accent/30 rounded-3xl hover:shadow-lg transition-all"
                          >
                            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white mb-3">
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-semibold text-secondary">{amenityLabel}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-[40px] p-10 shadow-premium sticky top-24">
              {/* Price */}
              <div className="mb-10">
                <p className="text-gray-500 text-sm mb-2">Starting from</p>
                <p className="text-4xl font-bold text-primary mb-2">GH₵{room.price_per_night}</p>
                <p className="text-gray-500 text-sm">Per night</p>
              </div>

              {/* Availability */}
              <div className="mb-10 p-4 bg-accent/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <p className="font-semibold text-gray-700">Available Now</p>
                </div>
                <p className="text-xs text-gray-500">Book this room for your perfect stay</p>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <button 
                  onClick={handleOpenBooking}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Check className="h-5 w-5" />
                  Book Room
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              {/* Features */}
              <div className="mt-10 pt-10 border-t border-gray-100 space-y-4">
                <div className="flex items-start gap-3">
                  <Wifi className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-secondary text-sm">High-Speed Internet</p>
                    <p className="text-xs text-gray-500">Complimentary WiFi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-secondary text-sm">Room Service</p>
                    <p className="text-xs text-gray-500">24/7 Available</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-secondary text-sm">View Type</p>
                    <p className="text-xs text-gray-500">{getRoomTypeFeatures(room.type_name).view}</p>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <Link 
                href="/rooms"
                className="block w-full mt-10 text-center py-3 bg-gray-100 text-secondary rounded-2xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back To Rooms
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[40px] p-10 max-w-xl w-full shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16 blur-2xl" />

            <h3 className="text-3xl font-bold text-secondary mb-2">Book {room.type_name}</h3>
            <p className="text-gray-500 text-sm mb-6">Confirm dates and details to complete your reservation.</p>

            <form onSubmit={handleBookRoomSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" /> Check-In Date
                  </label>
                  <input 
                    type="date" 
                    required 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" /> Check-Out Date
                  </label>
                  <input 
                    type="date" 
                    required 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" /> Guests
                  </label>
                  <select 
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                  >
                    {[...Array(room.capacity)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-primary" /> Contact Phone
                  </label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">ID Type</label>
                  <select 
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                  >
                    <option value="Passport">Passport</option>
                    <option value="Driver License">Driver's License</option>
                    <option value="National ID">National ID</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">ID / Document Number</label>
                  <input 
                    type="text" 
                    required 
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Enter document ID"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-primary" /> Nationality
                </label>
                <input 
                  type="text" 
                  required 
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="e.g. American, Ghanaian"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {checkIn && checkOut && (
                <div className="p-4 bg-accent/40 rounded-2xl border border-primary/10 mt-4 flex justify-between items-center text-secondary">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Estimated Bill</p>
                    <p className="text-sm font-semibold">
                      GH₵{room.price_per_night} x {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))} nights
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    GH₵{room.price_per_night * Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-250 text-secondary rounded-2xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/15 transition-all flex items-center gap-2"
                >
                  {bookingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Confirm Reservation <Check className="h-4 w-4" /></>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Footer />
    </main>
  );
};

export default RoomDetailsPage;
