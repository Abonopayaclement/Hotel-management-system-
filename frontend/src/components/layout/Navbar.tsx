'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Hotel, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Rooms', href: '/rooms' },
    { name: 'About', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];



  const dashboardHref = user?.role === 'Customer' ? '/guest-portal' : '/dashboard';

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Hotel className={`h-8 w-8 ${scrolled ? 'text-primary' : 'text-white'}`} />
            <span className={`text-xl font-bold tracking-tighter ${scrolled ? 'text-secondary' : 'text-white'}`}>
              HOLY STAR LUXURY HOTEL
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/' 
                  ? 'text-primary' 
                  : scrolled ? 'text-secondary' : 'text-white/90'
              }`}
            >
              Home
            </Link>

            <Link
              href="/rooms"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith('/rooms') 
                  ? 'text-primary' 
                  : scrolled ? 'text-secondary' : 'text-white/90'
              }`}
            >
              Rooms
            </Link>

            <Link
              href="/services"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith('/services')
                  ? 'text-primary'
                  : scrolled ? 'text-secondary' : 'text-white/90'
              }`}
            >
              Services
            </Link>

            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/about' 
                  ? 'text-primary' 
                  : scrolled ? 'text-secondary' : 'text-white/90'
              }`}
            >
              About
            </Link>

            <Link
              href="/gallery"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/gallery' 
                  ? 'text-primary' 
                  : scrolled ? 'text-secondary' : 'text-white/90'
              }`}
            >
              Gallery
            </Link>

            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/contact' 
                  ? 'text-primary' 
                  : scrolled ? 'text-secondary' : 'text-white/90'
              }`}
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href={dashboardHref} 
                  className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg"
                >
                  {user?.role === 'Customer' ? 'Guest Portal' : 'Dashboard'}
                </Link>
                <button onClick={logout} className={`cursor-pointer ${scrolled ? 'text-secondary' : 'text-white'}`}>
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={scrolled ? 'text-secondary' : 'text-white'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-secondary hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              <Link
                href="/rooms"
                className="block px-3 py-2 text-base font-medium text-secondary hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Rooms
              </Link>

              <Link
                href="/services"
                className="block px-3 py-2 text-base font-medium text-secondary hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>

              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium text-secondary hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <Link
                    href={dashboardHref}
                    className="block w-full text-center bg-primary text-white px-6 py-3 rounded-xl font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    {user?.role === 'Customer' ? 'Guest Portal' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-center bg-gray-100 text-secondary px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center mt-4 bg-primary text-white px-6 py-3 rounded-xl font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
