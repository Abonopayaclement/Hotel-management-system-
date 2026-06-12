'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Clock, MapPin } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[48px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80" 
                alt="Luxury Hotel Interior"
                className="w-full h-[600px] object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-accent/20 rounded-full blur-2xl -z-0" />
            
            <div className="absolute bottom-10 -right-10 bg-white p-8 rounded-[32px] shadow-xl z-20 hidden md:block border border-gray-50">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary">5 Star</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Luxury Rating</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Recognized globally for excellence <br /> in hospitality and service.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              Discover Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-8 leading-tight tracking-tight">
              A Legacy of <span className="italic font-light">Elegance</span> <br /> 
              and Modern Luxury
            </h2>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed font-light">
              For over a decade, HOLY STAR LUXURY HOTEL has been a beacon of sophisticated hospitality. 
              Our commitment to excellence transcends the ordinary, offering our guests a sanctuary 
              where every detail is curated for their ultimate comfort and satisfaction.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                'World Class Gastronomy',
                'Premium Spa & Wellness',
                'Exclusive Private Beach',
                '24/7 Concierge Service'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-secondary">{item}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
              <div className="text-center">
                <h4 className="text-3xl font-bold text-primary mb-1">150+</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Luxury Rooms</p>
              </div>
              <div className="text-center">
                <h4 className="text-3xl font-bold text-primary mb-1">12</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expert Chefs</p>
              </div>
              <div className="text-center">
                <h4 className="text-3xl font-bold text-primary mb-1">25k</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Happy Guests</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
