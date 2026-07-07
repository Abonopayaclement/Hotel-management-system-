'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Maximize, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

const fallbackRooms = [
  {
    id: 1,
    name: 'Presidential Suite',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    capacity: 4,
    size: '120m²',
    rating: 5.0
  },
  {
    id: 2,
    name: 'Executive Room',
    price: 600,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    capacity: 3,
    size: '80m²',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Deluxe Sea View',
    price: 400,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    capacity: 2,
    size: '45m²',
    rating: 4.8
  }
];

const FeaturedRooms = () => {
  const [roomsList, setRoomsList] = useState<any[]>(fallbackRooms);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/rooms');
        const dbRooms = response.data?.data || response.data || [];
        
        // Find one room for each type
        const pres = dbRooms.find((r: any) => (r.type_name || '').toLowerCase().includes('presidential'));
        const exec = dbRooms.find((r: any) => (r.type_name || '').toLowerCase().includes('executive'));
        const del = dbRooms.find((r: any) => (r.type_name || '').toLowerCase().includes('deluxe'));
        
        const list = [];
        if (pres) {
          list.push({
            id: pres.id,
            name: pres.type_name || 'Presidential Suite',
            price: pres.price_per_night || 1200,
            image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
            capacity: pres.capacity || 4,
            size: '120m²',
            rating: 5.0
          });
        }
        if (exec) {
          list.push({
            id: exec.id,
            name: exec.type_name || 'Executive Room',
            price: exec.price_per_night || 600,
            image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
            capacity: exec.capacity || 3,
            size: '80m²',
            rating: 4.9
          });
        }
        if (del) {
          list.push({
            id: del.id,
            name: del.type_name || 'Deluxe Room',
            price: del.price_per_night || 400,
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
            capacity: del.capacity || 2,
            size: '45m²',
            rating: 4.8
          });
        }

        if (list.length > 0) {
          setRoomsList(list);
        }
      } catch (error) {
        console.error('Failed to fetch rooms for FeaturedRooms', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">
              Our Accommodations
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary tracking-tight">
              Featured <span className="italic font-light">Rooms & Suites</span>
            </h2>
          </div>
          <Link 
            href="/rooms" 
            className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            View All Rooms <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roomsList.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/rooms/${room.id}`} className="block">
                <div className="relative h-[400px] overflow-hidden rounded-3xl mb-6 shadow-xl">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-secondary flex items-center gap-1 shadow-lg">
                      <Star className="h-3 w-3 text-primary fill-primary" />
                      {room.rating}
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-bold text-2xl mb-1">GH₵{room.price} <span className="text-sm font-normal text-white/70">/ Night</span></p>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                  {room.name}
                </h3>
                
                <div className="flex items-center gap-6 text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {room.capacity} Guests
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4" />
                    {room.size}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;

