'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

const ContactPage = () => {
  return (
    <main className="bg-white">
      <Navbar />
      
      {/* Hero */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-secondary" />
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-5xl font-bold tracking-tight">Contact <span className="text-gold-gradient">Us</span></h1>
          <p className="text-white/60 mt-4">We're here to help you 24/7 with any inquiries.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-secondary mb-8">Get In <span className="text-primary italic font-light">Touch</span></h2>
            <p className="text-gray-500 mb-12 leading-relaxed">
              Whether you have a question about our rooms, want to book a special event, 
              or just want to say hello, we'd love to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="h-14 w-14 bg-accent rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-premium">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-secondary text-lg">Our Location</h4>
                  <p className="text-gray-500 text-sm">123 Luxury Avenue, Paradise Beach, Grand Resort</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="h-14 w-14 bg-accent rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-premium">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-secondary text-lg">Phone Number</h4>
                  <p className="text-gray-500 text-sm">0550941056</p>
                  <a 
                    href="tel:0550941056"
                    className="inline-block mt-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all"
                  >
                    Call Now
                  </a>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="h-14 w-14 bg-accent rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-premium">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-secondary text-lg">WhatsApp</h4>
                  <p className="text-gray-500 text-sm">0503317207</p>
                  <a 
                    href="https://wa.me/233503317207"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-all"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F8F9FA] p-12 rounded-[40px] shadow-sm border border-gray-100"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</label>
                <input type="text" placeholder="Inquiry about suite availability" className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                <textarea rows={5} placeholder="Your message here..." className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm resize-none"></textarea>
              </div>
              <button className="w-full bg-secondary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/10">
                Send Message <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ContactPage;
