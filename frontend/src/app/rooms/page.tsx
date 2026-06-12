'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, BedDouble, Users, Maximize, Star, Calendar } from 'lucide-react';
import api from '@/lib/api';

const RoomsListingPage = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/rooms');
        const roomsData = response.data?.data ?? response.data ?? [];
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <main className="bg-[#F8F9FA]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80")' }}
        />
        <div className="absolute inset-0 bg-secondary/60 z-10" />
        <div className="relative z-20 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            Rooms & <span className="text-gold-gradient">Suites</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 max-w-xl mx-auto"
          >
            Choose from our collection of elegantly designed rooms, each offering a unique blend of comfort and luxury.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-30">
        <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <Calendar className="text-primary h-5 w-5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Dates</p>
                <p className="text-sm font-bold text-secondary">Oct 24 - Oct 28</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <Users className="text-primary h-5 w-5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Guests</p>
                <p className="text-sm font-bold text-secondary">2 Adults, 1 Child</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <Filter className="text-primary h-5 w-5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Filter By</p>
                <p className="text-sm font-bold text-secondary">All Room Types</p>
              </div>
            </div>
          </div>
          <button className="w-full md:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
            <Search className="h-4 w-4" />
            Update Search
          </button>
        </div>
      </section>

      {/* Room Listing */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[40px] h-[500px] animate-pulse" />
            ))
          ) : (
            rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[40px] overflow-hidden shadow-premium group border border-transparent hover:border-primary/20 transition-all card-hover"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={room.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'} 
                    alt={room.type_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-secondary flex items-center gap-1 shadow-lg uppercase tracking-widest">
                    {room.status}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-secondary mb-1">{room.type_name}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-primary fill-primary" />
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">GH₵{room.price_per_night}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">per night</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-gray-500 text-xs mb-8">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {room.capacity} Guests
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize className="h-4 w-4" />
                      {room.capacity * 25}m²
                    </div>
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4" />
                      King Bed
                    </div>
                  </div>

                  <Link 
                    href={`/rooms/${room.id}`}
                    className="block w-full text-center py-4 bg-secondary text-white rounded-2xl font-bold hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/10"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default RoomsListingPage;
