'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-scale duration-[10s] ease-out scale-110"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        }}
      />
      <div className="absolute inset-0 z-10 bg-black/40" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.3em] uppercase text-primary bg-white/10 backdrop-blur-md rounded-full">
            Welcome to Luxury
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight">
            The Ultimate <span className="text-gold-gradient">Luxury</span> <br />
            Experience
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 mb-12 font-light leading-relaxed">
            Welcome to HOLY STAR LUXURY HOTEL. Discover a sanctuary of elegance and comfort. 
            From breathtaking views to world-class service, we define the art of luxury hospitality.
          </p>
        </motion.div>

        {/* Search Widget */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto glass p-2 md:p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-4"
        >
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl hover:bg-white transition-all cursor-pointer">
              <Calendar className="text-primary h-5 w-5" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Check In</p>
                <p className="text-sm font-semibold text-secondary">Oct 24, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl hover:bg-white transition-all cursor-pointer">
              <Calendar className="text-primary h-5 w-5" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Check Out</p>
                <p className="text-sm font-semibold text-secondary">Oct 28, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl hover:bg-white transition-all cursor-pointer">
              <Users className="text-primary h-5 w-5" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Guests</p>
                <p className="text-sm font-semibold text-secondary">2 Adults, 1 Child</p>
              </div>
            </div>
          </div>
          <button className="w-full md:w-auto px-10 py-5 bg-secondary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-xl">
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
