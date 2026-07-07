'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, Bed } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [roomType, setRoomType] = useState('all');

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (checkIn) query.append('checkIn', checkIn);
    if (checkOut) query.append('checkOut', checkOut);
    if (guests) query.append('guests', guests);
    if (roomType !== 'all') query.append('type', roomType);

    router.push(`/rooms?${query.toString()}`);
  };

  return (
    <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-scale duration-[10s] ease-out scale-110"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        }}
      />
      <div className="absolute inset-0 z-10 bg-black/45" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.3em] uppercase text-primary bg-white/10 backdrop-blur-md rounded-full">
            Welcome to Luxury
          </span>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight">
            The Ultimate <span className="text-gold-gradient">Luxury</span> <br />
            Experience
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-xl text-white/80 mb-12 font-light leading-relaxed">
            Welcome to HOLY STAR LUXURY HOTEL. Discover a sanctuary of elegance and comfort. 
            From breathtaking views to world-class service, we define the art of luxury hospitality.
          </p>
        </motion.div>

        {/* Search Widget */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto glass p-3 md:p-5 rounded-[32px] shadow-2xl flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            {/* Check-In */}
            <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 hover:bg-white transition-all text-left">
              <Calendar className="text-primary h-5 w-5 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500">Check In</label>
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-semibold text-secondary focus:outline-none focus:ring-0 p-0 m-0"
                />
              </div>
            </div>

            {/* Check-Out */}
            <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 hover:bg-white transition-all text-left">
              <Calendar className="text-primary h-5 w-5 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500">Check Out</label>
                <input 
                  type="date" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-semibold text-secondary focus:outline-none focus:ring-0 p-0 m-0"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 hover:bg-white transition-all text-left">
              <Users className="text-primary h-5 w-5 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-semibold text-secondary focus:outline-none focus:ring-0 p-0 m-0 cursor-pointer appearance-none"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>
            </div>

            {/* Room Type */}
            <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 hover:bg-white transition-all text-left">
              <Bed className="text-primary h-5 w-5 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-semibold text-secondary focus:outline-none focus:ring-0 p-0 m-0 cursor-pointer appearance-none"
                >
                  <option value="all">All Room Types</option>
                  <option value="Single">Single Room</option>
                  <option value="Double">Double Room</option>
                  <option value="Deluxe">Deluxe Room</option>
                  <option value="Executive">Executive Room</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                  <option value="Duplex Suite">Duplex Suite</option>
                </select>
              </div>
            </div>
          </div>
          <button 
            onClick={handleSearch}
            className="w-full py-4.5 bg-secondary hover:bg-secondary/95 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-secondary/20 cursor-pointer"
          >
            <Search className="h-5 w-5" />
            Check Availability
          </button>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 z-20 hidden lg:block">
        <div className="flex items-center gap-4 text-white/60 text-sm tracking-widest uppercase vertical-text">
          <div className="w-[1px] h-20 bg-white/20" />
          Scroll to explore
        </div>
      </div>
    </div>
  );
};

export default Hero;
