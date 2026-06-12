'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Happy Guests', value: '50K+' },
  { label: 'Luxury Rooms', value: '150+' },
  { label: 'Awards Won', value: '12' },
  { label: 'Years of Excellence', value: '25+' }
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-premium-gradient relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 text-gold-gradient">
                {stat.value}
              </h3>
              <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
