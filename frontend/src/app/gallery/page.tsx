'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'reception', label: 'Reception' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'events', label: 'Events' },
    { id: 'exterior', label: 'Exterior' },
  ];

  const galleryImages = [
    {
      id: 1,
      category: 'reception',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      title: 'Grand Lobby',
      description: 'Our magnificent hotel lobby with elegant design'
    },
    {
      id: 2,
      category: 'rooms',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      title: 'Luxury Suite',
      description: 'Premium room with panoramic views'
    },
    {
      id: 3,
      category: 'pool',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
      title: 'Infinity Pool',
      description: 'Olympic-sized swimming pool overlooking the coast'
    },
    {
      id: 4,
      category: 'restaurant',
      image: 'https://images.unsplash.com/photo-1550966841-3eecc57b209e?auto=format&fit=crop&w=800&q=80',
      title: 'Fine Dining Restaurant',
      description: 'Award-winning culinary experience'
    },
    {
      id: 5,
      category: 'exterior',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      title: 'Hotel Exterior',
      description: 'Stunning architecture at twilight'
    },
    {
      id: 6,
      category: 'events',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      title: 'Gala Event',
      description: 'Perfect venue for grand celebrations'
    },
    {
      id: 7,
      category: 'rooms',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
      title: 'Executive Suite',
      description: 'Modern luxury for the discerning traveler'
    },
    {
      id: 8,
      category: 'reception',
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80',
      title: 'Reception Desk',
      description: 'Warm welcome at our 24/7 front desk'
    },
    {
      id: 9,
      category: 'pool',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      title: 'Poolside Lounge',
      description: 'Relaxation and comfort under the sun'
    },
    {
      id: 10,
      category: 'restaurant',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
      title: 'Chef Special Dining',
      description: 'Exquisite meals prepared by master chefs'
    },
    {
      id: 11,
      category: 'exterior',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      title: 'Beach Frontage',
      description: 'Direct access to the pristine private beach'
    },
    {
      id: 12,
      category: 'events',
      image: 'https://images.unsplash.com/photo-1519167758993-c5cd864e1b13?auto=format&fit=crop&w=800&q=80',
      title: 'Business Conference',
      description: 'State-of-the-art facilities for your meetings'
    },
  ];

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const handlePrevImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleNextImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  return (
    <main className="bg-[#F8F9FA]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1579550904786-fd9e4e36c04f?auto=format&fit=crop&w=1920&q=80")' }}
        />
        <div className="absolute inset-0 bg-secondary/60 z-10" />
        <div className="relative z-20 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            Photo <span className="text-gold-gradient">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80"
          >
            Explore the beauty of our hotel
          </motion.p>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white text-secondary border-2 border-gray-200 hover:border-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedImage(image)}
                className="group relative h-72 rounded-[32px] overflow-hidden shadow-premium cursor-pointer hover:shadow-xl transition-all"
              >
                <img 
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    <h3 className="text-white font-bold text-lg">{image.title}</h3>
                    <p className="text-white/80 text-sm">{image.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <img 
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto rounded-[24px] max-h-[80vh] object-contain"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
                <p className="text-white/80">{selectedImage.description}</p>
              </div>

              {/* Navigation */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
};

export default GalleryPage;
