'use client';

import React from 'react';
import Link from 'next/link';
import { Hotel, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <Hotel className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold tracking-tighter">HOLY STAR LUXURY HOTEL</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Luxury Redefined. Experience the ultimate comfort and elegance at Holy Star Luxury Hotel. 
              We provide world-class hospitality for your perfect stay.
            </p>
            <div className="flex gap-4">
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.9 2.9 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.4-.05z" />
                </svg>
              </a>
              <a href="https://wa.me/233503317207" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500 transition-all">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="/rooms" className="hover:text-primary transition-all">Rooms & Suites</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-all">About Us</Link></li>
              <li><Link href="/restaurant" className="hover:text-primary transition-all">Restaurant</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-all">Our Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-all">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Contact Us</h4>
            <ul className="space-y-6 text-sm text-white/60">
              <li className="flex gap-4">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                <span>123 Luxury Avenue, Paradise Beach, <br />Grand Resort, Ghana</span>
              </li>
              <li className="flex gap-4">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-1" />
                <span>0550941056 <br />WhatsApp: 0503317207</span>
              </li>
              <li className="flex gap-4">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-1" />
                <span>reservations@holystar.com <br />support@holystar.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Newsletter</h4>
            <p className="text-sm text-white/60 mb-6">
              Subscribe to get latest updates and special offers.
            </p>
            <form className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="Your Email Address"
                className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
              <button className="bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/40">
          <p>© 2026 HOLY STAR LUXURY HOTEL Management System. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-all">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-all">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
