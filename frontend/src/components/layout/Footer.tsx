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
            <div className="flex flex-wrap gap-3">
              <a
                href="https://facebook.com/holystarhotel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-white/80"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/holystarhotel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all text-white/80"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@holystarhotel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-black hover:text-white transition-all text-white/80"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.9 2.9 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85  0 0 1-1.04-.1z" />
                </svg>
              </a>
              <a
                href="https://x.com/holystarhotel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gray-400 hover:text-white transition-all text-white/80"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://wa.me/233503317207"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all text-green-500"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.388 1.97 13.916.939 11.299.939c-5.437 0-9.862 4.372-9.866 9.802a9.736 9.736 0 001.5 5.122l-.98 3.58 3.676-.957zM17.486 14.3c-.3-.149-1.772-.862-2.046-.961-.273-.1-.472-.148-.67.149-.197.297-.767.962-.94 1.16-.173.199-.347.223-.647.074-.3-.15-1.27-.462-2.42-1.474-.895-.79-1.5-1.764-1.677-2.062-.177-.3-.018-.462.13-.61.135-.133.3-.347.45-.52.15-.173.2-.297.3-.495.1-.2.05-.375-.025-.524-.075-.15-.67-1.59-.92-2.185-.243-.584-.489-.505-.67-.514-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.772-.716 2.022-1.412.25-.695.25-1.29.176-1.412-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="/rooms" className="hover:text-primary transition-all">Rooms & Suites</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-all">About Us</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-all">Our Services</Link></li>
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
