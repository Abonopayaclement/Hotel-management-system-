'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, BedDouble, Users, Maximize, Star, Calendar, ArrowUpDown } from 'lucide-react';
import api from '@/lib/api';

const getRoomImage = (typeName: string) => {
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

const getRoomSize = (typeName: string) => {
  const name = typeName.toLowerCase();
  if (name.includes('single')) return 25;
  if (name.includes('double')) return 45;
  if (name.includes('deluxe')) return 60;
  if (name.includes('executive')) return 85;
  if (name.includes('presidential')) return 150;
  if (name.includes('duplex') || name.includes('family')) return 180;
  return 50;
};

const RoomsListingPage = () => {
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [roomType, setRoomType] = useState('all');
  const [capacity, setCapacity] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceSort, setPriceSort] = useState('none');
  const [availability, setAvailability] = useState('all');
  const [roomSize, setRoomSize] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedViews, setSelectedViews] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load query params from Hero search
  useEffect(() => {
    if (searchParams) {
      const typeParam = searchParams.get('type');
      const guestsParam = searchParams.get('guests');
      if (typeParam) setRoomType(typeParam);
      if (guestsParam) setCapacity(guestsParam);
    }
  }, [searchParams]);

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

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoomType('all');
    setCapacity('all');
    setMinPrice('');
    setMaxPrice('');
    setPriceSort('none');
    setAvailability('all');
    setRoomSize('all');
    setSelectedAmenities([]);
    setSelectedViews('all');
  };

  // Filter & Sort rooms client-side for immediate responsive results
  const filteredRooms = rooms.filter(room => {
    // Search query
    if (searchQuery) {
      const matchSearch = room.room_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (room.type_name && room.type_name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchSearch) return false;
    }

    // Room Type
    if (roomType !== 'all') {
      if (room.type_name !== roomType) return false;
    }

    // Capacity
    if (capacity !== 'all') {
      const capInt = parseInt(capacity);
      if (capInt === 5) {
        if (room.capacity < 5) return false;
      } else {
        if (room.capacity !== capInt) return false;
      }
    }

    // Availability
    if (availability !== 'all' && room.status !== availability) return false;

    // Price Range
    if (minPrice && room.price_per_night < parseFloat(minPrice)) return false;
    if (maxPrice && room.price_per_night > parseFloat(maxPrice)) return false;

    // Room Size space
    const size = getRoomSize(room.type_name || '');
    if (roomSize !== 'all') {
      if (roomSize === 'Small' && size >= 35) return false;
      if (roomSize === 'Medium' && (size < 35 || size >= 55)) return false;
      if (roomSize === 'Large' && (size < 55 || size >= 100)) return false;
      if (roomSize === 'Suite' && size < 100) return false;
    }

    // Views
    if (selectedViews !== 'all') {
      const name = (room.type_name || '').toLowerCase();
      if (selectedViews === 'Ocean' && !name.includes('deluxe')) return false;
      if (selectedViews === 'Courtyard' && !name.includes('single')) return false;
      if (selectedViews === 'City' && !name.includes('double')) return false;
      if (selectedViews === 'Panoramic' && !name.includes('executive')) return false;
      if (selectedViews === 'Skyline' && !name.includes('presidential')) return false;
      if (selectedViews === 'Penthouse' && !name.includes('duplex')) return false;
    }

    // Amenities
    if (selectedAmenities.length > 0) {
      let roomAmenities: string[] = [];
      try {
        roomAmenities = typeof room.amenities === 'string' ? JSON.parse(room.amenities) : (room.amenities || []);
      } catch (e) {
        roomAmenities = [];
      }
      for (const filterAmenity of selectedAmenities) {
        const hasAmenity = roomAmenities.some(a => a.toLowerCase().includes(filterAmenity.toLowerCase()));
        if (!hasAmenity) return false;
      }
    }

    return true;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (priceSort === 'low-to-high') return a.price_per_night - b.price_per_night;
    if (priceSort === 'high-to-low') return b.price_per_night - a.price_per_night;
    return 0;
  });

  return (
    <main className="bg-[#F8F9FA] min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80")' }}
        />
        <div className="absolute inset-0 bg-secondary/65 z-10" />
        <div className="relative z-20 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
          >
            Rooms & <span className="text-gold-gradient">Suites</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 max-w-xl mx-auto text-sm"
          >
            Explore our collection of premium, luxury suites tailored to your comfort and leisure.
          </motion.p>
        </div>
      </section>

      {/* Main Grid: Sidebar + List */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Advanced Filter Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-[32px] shadow-premium border border-gray-100 font-sans h-fit lg:sticky lg:top-24 lg:flex lg:flex-col lg:max-h-[calc(100vh-7rem)] lg:space-y-0 lg:gap-4 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
              <span className="font-bold text-secondary text-base flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" /> Filter Options
              </span>
              <button 
                onClick={handleResetFilters}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Search - Always Visible */}
            <div className="space-y-1 shrink-0">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Search Room</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Number or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all font-semibold"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Mobile Expand Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full lg:hidden py-2.5 bg-gray-50 hover:bg-gray-100 text-secondary border border-gray-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Filter className="h-3.5 w-3.5" />
              {showMobileFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </button>

            {/* Collapsible content panel */}
            <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block lg:flex-1 lg:overflow-y-auto lg:pr-1 overscroll-contain custom-scrollbar space-y-4 pt-2 lg:pt-0`}>
              {/* Room Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Room Category</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all cursor-pointer font-semibold"
                >
                  <option value="all">All Categories</option>
                  <option value="Single">Single Room</option>
                  <option value="Double">Double Room</option>
                  <option value="Deluxe">Deluxe Room</option>
                  <option value="Executive">Executive Room</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                  <option value="Duplex Suite">Duplex Suite</option>
                </select>
              </div>

              {/* Guests Capacity */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Guests Capacity</label>
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all cursor-pointer font-semibold"
                >
                  <option value="all">Any Occupancy</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>

              {/* Availability */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Availability</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all cursor-pointer font-semibold"
                >
                  <option value="all">Any Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              {/* Price Sort & Range */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Sort by Price</label>
                  <select
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all cursor-pointer font-semibold"
                  >
                    <option value="none">Default Sort</option>
                    <option value="low-to-high">Lowest to Highest</option>
                    <option value="high-to-low">Highest to Lowest</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Price Range (GH₵)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                    />
                    <input 
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Room Size */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Room Size Space</label>
                <select
                  value={roomSize}
                  onChange={(e) => setRoomSize(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all cursor-pointer font-semibold"
                >
                  <option value="all">Any Size</option>
                  <option value="Small">Small (&lt; 35m²)</option>
                  <option value="Medium">Medium (35m² - 55m²)</option>
                  <option value="Large">Large (55m² - 100m²)</option>
                  <option value="Suite">Suite / Extra Large (&gt; 100m²)</option>
                </select>
              </div>

              {/* Views */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">View Preference</label>
                <select
                  value={selectedViews}
                  onChange={(e) => setSelectedViews(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all cursor-pointer font-semibold"
                >
                  <option value="all">Any View</option>
                  <option value="Courtyard">Courtyard View</option>
                  <option value="City">City View</option>
                  <option value="Ocean">Ocean View</option>
                  <option value="Panoramic">Panoramic View</option>
                  <option value="Skyline">Skyline View</option>
                  <option value="Penthouse">Penthouse View</option>
                </select>
              </div>

              {/* Amenities Checklist */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Amenities Included</label>
                <div className="space-y-2 text-xs text-gray-600 max-h-40 overflow-y-auto pr-1">
                  {[
                    'Free WiFi', 'AC', 'TV', 'Mini Bar', 'Bathtub', 'Balcony', 
                    'Private Terrace', 'Jacuzzi', 'Private Plunge Pool', 'Kitchenette'
                  ].map(amenity => (
                    <label key={amenity} className="flex items-center gap-2.5 cursor-pointer hover:text-primary transition-colors">
                      <input 
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 text-sm font-semibold">
                Showing <span className="text-secondary font-bold">{sortedRooms.length}</span> rooms
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[40px] h-[450px] animate-pulse" />
                ))}
              </div>
            ) : sortedRooms.length === 0 ? (
              <div className="bg-white p-16 rounded-[40px] text-center shadow-premium">
                <p className="text-xl font-semibold text-secondary mb-2">No Rooms Match Your Criteria</p>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search keywords.</p>
                <button 
                  onClick={handleResetFilters}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sortedRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-[40px] overflow-hidden shadow-premium group border border-transparent hover:border-primary/20 transition-all card-hover flex flex-col justify-between min-h-[500px]"
                  >
                    <div className="relative h-64 overflow-hidden shrink-0">
                      <img 
                        src={getRoomImage(room.type_name || '')} 
                        alt={room.type_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-secondary flex items-center gap-1 shadow-lg uppercase tracking-widest">
                        {room.status}
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
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

                        <div className="flex items-center gap-4 text-gray-500 text-xs mb-8">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-primary" />
                            {room.capacity} Guests
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Maximize className="h-4 w-4 text-primary" />
                            {getRoomSize(room.type_name || '')}m²
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BedDouble className="h-4 w-4 text-primary" />
                            {room.type_name.toLowerCase().includes('single') ? 'Single Bed' : 'King Bed'}
                          </div>
                        </div>
                      </div>

                      <Link 
                        href={`/rooms/${room.id}`}
                        className="block w-full text-center py-4 bg-secondary hover:bg-secondary/95 text-white rounded-2xl font-bold transition-all shadow-xl hover:shadow-secondary/15 cursor-pointer"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
};

export default function RoomsPage() {
  return (
    <Suspense fallback={
      <main className="bg-[#F8F9FA] min-h-screen">
        <Navbar />
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <Footer />
      </main>
    }>
      <RoomsListingPage />
    </Suspense>
  );
}
