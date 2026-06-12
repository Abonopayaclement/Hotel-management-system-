'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, ShieldCheck, Heart, Zap, Sparkles, Globe } from 'lucide-react';

const services = [
  {
    icon: ShieldCheck,
    title: 'Safe & Secure',
    description: 'Advanced 24/7 security systems and professional staff ensuring your complete peace of mind.'
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'High-speed fiber internet and seamless check-in process for the modern traveler.'
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description: 'Our staff anticipates your needs to provide a truly bespoke hospitality experience.'
  },
  {
    icon: Coffee,
    title: 'World-Class Dining',
    description: 'Award-winning culinary experiences from breakfast to late-night fine dining.'
  },
  {
    icon: Sparkles,
    title: 'Premium Spa',
    description: 'Revitalize your body and mind with our exclusive treatments and wellness programs.'
  },
  {
    icon: Globe,
    title: 'Prime Location',
    description: 'Situated in the heart of the city with easy access to all major attractions and business hubs.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
          >
            Why Choose Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-secondary tracking-tight"
          >
            Experience the <span className="italic font-light">Difference</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-premium transition-all duration-500 group"
            >
              <div className="h-16 w-16 bg-accent/30 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <service.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-500 leading-relaxed font-light">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
