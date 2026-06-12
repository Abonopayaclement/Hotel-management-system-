'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Business Traveler',
    text: 'The best hotel experience I\'ve had in years. The service was impeccable and the Presidential Suite is truly world-class.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
  },
  {
    name: 'Michael Chen',
    role: 'Luxury Lifestyle Blogger',
    text: 'Holy Star combines modern luxury with traditional hospitality. The restaurant\'s tasting menu is a must-try!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  },
  {
    name: 'Emma Williams',
    role: 'Family Vacationer',
    text: 'The kids loved the pool and the family suites are so spacious. We\'ve already booked our next stay for next summer.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">
          Guest Reviews
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-16 tracking-tight">
          What Our <span className="italic font-light">Guests Say</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-10 rounded-[40px] shadow-premium relative text-left"
            >
              <Quote className="absolute top-8 right-10 h-10 w-10 text-primary/10" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <img src={testimonial.avatar} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover shadow-md" />
                <div>
                  <h4 className="font-bold text-secondary">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
