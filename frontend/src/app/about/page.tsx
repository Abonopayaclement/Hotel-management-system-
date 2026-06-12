'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Users, Globe } from 'lucide-react';

const AboutPage = () => {
  return (
    <main className="bg-white">
      <Navbar />
      
      {/* Hero */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
        />
        <div className="absolute inset-0 bg-secondary/70 z-10" />
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">Our <span className="text-gold-gradient">Story</span></h1>
          <p className="text-white/70 max-w-2xl mx-auto font-light text-lg">
            Dedicated to providing an unforgettable experience of luxury and hospitality since 1998.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">About Holy Star</span>
            <h2 className="text-4xl font-bold text-secondary mb-8 tracking-tight">Redefining the Art of <span className="text-primary italic font-light">Hospitality</span></h2>
            <div className="space-y-6 text-gray-500 leading-relaxed">
              <p>
                Founded on the principles of elegance, comfort, and personalized service, Holy Star 
                Hotel Management System has grown from a single boutique hotel to a global 
                benchmark for luxury hospitality.
              </p>
              <p>
                Our mission is to create a sanctuary where every detail is meticulously crafted to 
                provide our guests with an unparalleled experience. From our world-class 
                amenities to our dedicated staff, we strive for excellence in everything we do.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="flex gap-4">
                <CheckCircle className="text-primary h-6 w-6 shrink-0" />
                <div>
                  <h4 className="font-bold text-secondary">Premium Service</h4>
                  <p className="text-xs text-gray-400 mt-1">24/7 personalized concierge</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="text-primary h-6 w-6 shrink-0" />
                <div>
                  <h4 className="font-bold text-secondary">Luxury Suites</h4>
                  <p className="text-xs text-gray-400 mt-1">Exquisite design & comfort</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" 
                alt="Luxury Hotel"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-primary p-10 rounded-[40px] shadow-2xl hidden md:block">
              <p className="text-white text-5xl font-bold mb-1">25+</p>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Years of Excellence</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;
