
'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/layout/Hero';
import FeaturedRooms from '@/components/sections/FeaturedRooms';
import StatsSection from '@/components/sections/StatsSection';
import Testimonials from '@/components/sections/Testimonials';
import { motion } from 'framer-motion';
import { Star, ArrowRight, MapPin, Phone, Mail } from 'lucide-react';

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      
      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            Welcome to <span className="text-primary">Holy Star</span> Hotel
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Experience luxury, comfort, and exceptional service at our premium hotel. 
            We offer world-class accommodations with state-of-the-art amenities for an unforgettable stay.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-accent/50 to-accent/30 p-8 rounded-[32px] text-center"
          >
            <div className="text-4xl font-bold text-primary mb-3">500+</div>
            <p className="text-secondary font-semibold">Rooms & Suites</p>
            <p className="text-gray-600 text-sm mt-2">Elegantly designed accommodations</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-accent/50 to-accent/30 p-8 rounded-[32px] text-center"
          >
            <div className="text-4xl font-bold text-primary mb-3">50K+</div>
            <p className="text-secondary font-semibold">Happy Guests</p>
            <p className="text-gray-600 text-sm mt-2">Trusted by travelers worldwide</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-accent/50 to-accent/30 p-8 rounded-[32px] text-center"
          >
            <div className="text-4xl font-bold text-primary mb-3">24/7</div>
            <p className="text-secondary font-semibold">Support</p>
            <p className="text-gray-600 text-sm mt-2">Always here to serve you</p>
          </motion.div>
        </div>
      </section>

      <FeaturedRooms />
      <StatsSection />
      <Testimonials />
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-secondary to-secondary/80 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6"
          >
            Ready for your next adventure?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg mb-8 text-white/80"
          >
            Book your stay now and experience luxury like never before.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/rooms"
              className="bg-white text-secondary px-8 py-4 rounded-2xl font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
            >
              Explore Rooms
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
