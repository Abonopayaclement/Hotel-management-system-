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
  Wardrobe,
  Bell,
  Check,
  ArrowRight,
  X
} from 'lucide-react';
import api from '@/lib/api';

const amenities = [
  { icon: Bath, label: 'Private Bathroom' },
  { icon: Wind, label: 'Air Conditioning' },
  { icon: Tv, label: 'Television' },
  { icon: Wifi, label: 'Free Wi-Fi' },
  { icon: Wine, label: 'Mini Bar' },
  { icon: Bath, label: 'Refrigerator' },
  { icon: Sofa, label: 'Balcony' },
  { icon: Bell, label: 'Room Service' },
  { icon: Coffee, label: 'Coffee Maker' },
  { icon: Droplets, label: 'Hot Water' },
  { icon: Wardrobe, label: 'Wardrobe' },
  { icon: Lock, label: 'Safe Box' },
];

const RoomDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;
  
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <main className="bg-[#F8F9FA]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="animate-pulse space-y-8">
            <div className="h-[500px] bg-gray-200 rounded-[40px]" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-10 bg-gray-200 rounded-xl w-1/2" />
                <div className="h-6 bg-gray-200 rounded-xl w-1/4" />
                <div className="h-64 bg-gray-200 rounded-[32px]" />
              </div>
              <div className="h-96 bg-gray-200 rounded-[40px]" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !room) {
    return (
      <main className="bg-[#F8F9FA]">
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <div className="bg-white p-12 rounded-[40px] shadow-premium max-w-md w-full">
            <div className="h-20 w-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold text-secondary mb-4">
              {error === 'Room not found' ? 'Room Not Found' : 'Something went wrong'}
            </h1>
            <p className="text-gray-500 mb-8">
              {error === 'Room not found' 
                ? "The room you're looking for doesn't exist or has been removed." 
                : "We encountered an error while trying to load the room details. Please try again later."}
            </p>
            <Link 
              href="/rooms" 
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Rooms
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-[#F8F9FA]">
      <Navbar />

      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2">
          <Link href="/rooms" className="flex items-center gap-1 text-primary hover:text-primary/80 transition-all text-sm font-semibold">
            <ChevronLeft className="h-4 w-4" />
            Rooms
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 text-sm">{room.type_name || 'Room Details'}</span>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative h-[600px] overflow-hidden">
        <img 
          src={room.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920&q=80'}
          alt={room.type_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md px-6 py-2 rounded-full text-sm font-bold text-secondary shadow-2xl uppercase tracking-widest border border-white/20">
          {room.status || 'Available'}
        </div>
        <div className="absolute bottom-12 left-12 text-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {room.room_number ? `Room ${room.room_number}` : 'Premium Suite'}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-primary fill-primary" />
              ))}
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-2">{room.type_name}</h1>
          <p className="text-white/80 text-lg max-w-2xl">Experience the pinnacle of luxury in our meticulously designed {room.type_name}.</p>
        </div>
      </section>

      {/* Room Details */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-[48px] p-8 md:p-16 shadow-premium border border-gray-50">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16">
                <div className="flex items-center gap-4 p-6 bg-accent/20 rounded-[32px] border border-accent/30">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Guests</p>
                    <p className="text-lg font-bold text-secondary">{room.capacity || 2} People</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-6 bg-accent/20 rounded-[32px] border border-accent/30">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <Maximize className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Size</p>
                    <p className="text-lg font-bold text-secondary">{(room.capacity || 2) * 25}m²</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-6 bg-accent/20 rounded-[32px] border border-accent/30">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <BedDouble className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Beds</p>
                    <p className="text-lg font-bold text-secondary">King Size</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-secondary mb-6 tracking-tight">Room Overview</h2>
                <div className="prose prose-lg text-gray-600 max-w-none">
                  <p className="mb-6 leading-relaxed">
                    {room.description || `Welcome to our ${room.type_name}, where luxury meets functionality. This room has been carefully crafted to provide an exceptional experience, featuring premium materials and thoughtful touches throughout.`}
                  </p>
                  <p className="leading-relaxed">
                    Enjoy breathtaking views and world-class amenities designed to make your stay unforgettable. From the high-quality linens to the state-of-the-art entertainment system, every detail has been considered for your comfort.
                  </p>
                </div>
              </div>

              {/* Amenities Section */}
              <div>
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-bold text-secondary tracking-tight">Exclusive Amenities</h2>
                  <span className="text-primary font-bold text-sm bg-primary/5 px-4 py-2 rounded-full">Included with stay</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {amenities.map((amenity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex flex-col items-center text-center p-8 bg-gray-50 rounded-[32px] border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300"
                    >
                      <div className="h-14 w-14 bg-white group-hover:bg-primary rounded-2xl flex items-center justify-center text-primary group-hover:text-white mb-4 shadow-sm transition-all duration-300">
                        <amenity.icon className="h-7 w-7" />
                      </div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest">{amenity.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-[48px] p-10 shadow-premium border border-gray-50 sticky top-24">
              <div className="flex justify-between items-end mb-10 pb-10 border-b border-gray-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Price per night</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary">GH₵{room.price_per_night || room.price}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary mb-1">
                    <Star className="h-3 w-3 fill-primary" />
                    <span className="text-sm font-bold">4.9</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Average rating</p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className={`mb-10 p-5 rounded-3xl flex items-center gap-4 ${
                (room.status === 'Available' || !room.status) ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  (room.status === 'Available' || !room.status) ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {(room.status === 'Available' || !room.status) ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-bold text-sm">{(room.status === 'Available' || !room.status) ? 'Room is Available' : 'Room Currently Busy'}</p>
                  <p className="text-xs opacity-80">Book now to secure your stay</p>
                </div>
              </div>

              {/* Booking Buttons */}
              <div className="space-y-4">
                <button 
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
                >
                  Book Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full border-2 border-secondary text-secondary py-5 rounded-2xl font-bold hover:bg-secondary hover:text-white transition-all">
                  Reserve This Room
                </button>
                <Link 
                  href="/rooms"
                  className="block w-full text-center py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all text-xs uppercase tracking-widest"
                >
                  Back To All Rooms
                </Link>
              </div>

              {/* Guarantee Section */}
              <div className="mt-10 pt-10 border-t border-gray-100">
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Our Premium Services</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center gap-2 p-4 bg-accent/20 rounded-2xl border border-accent/30">
                    <Wifi className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-bold text-secondary uppercase">Free WiFi</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-accent/20 rounded-2xl border border-accent/30">
                    <Bell className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-bold text-secondary uppercase">24/7 Service</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default RoomDetailsPage;
