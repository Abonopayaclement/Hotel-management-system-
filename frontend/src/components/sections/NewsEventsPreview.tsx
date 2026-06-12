'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const news = [
  {
    category: 'Promotions',
    title: 'Luxury Weekend Getaway',
    date: 'June 15, 2026',
    image: 'https://images.unsplash.com/photo-1571011299480-13da667e89a5?auto=format&fit=crop&w=800&q=80'
  },
  {
    category: 'Hotel News',
    title: 'New Spa Treatments Revealed',
    date: 'June 10, 2026',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&w=800&q=80'
  },
  {
    category: 'Events',
    title: 'Annual Summer Gala 2026',
    date: 'June 05, 2026',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
  }
];

const NewsEventsPreview = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              Hotel Updates
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary tracking-tight">
              News & <span className="italic font-light">Events</span>
            </h2>
          </div>
          <Link 
            href="/blog" 
            className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
          >
            Explore All Updates <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden rounded-[32px] mb-6 shadow-lg">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white px-4 py-1.5 rounded-full text-[10px] font-bold text-primary shadow-lg uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{item.date}</p>
              <h3 className="text-2xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-secondary font-bold text-sm group-hover:text-primary transition-colors">
                Read Article <ArrowRight className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
          >
            View All News <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsEventsPreview;
