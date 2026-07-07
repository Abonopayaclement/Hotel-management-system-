'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, Wrench, MessageSquare, AlertTriangle, Check } from 'lucide-react';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';
import { useAuthStore } from '@/store/authStore';

const ContactPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [formType, setFormType] = useState<'inquiry' | 'support'>('inquiry');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setFormType('inquiry');
    }
  }, [isAuthenticated]);

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [category, setCategory] = useState('Maintenance problem');
  const [urgency, setUrgency] = useState('Medium');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formType === 'support') {
        if (!name || !email || !phone || !roomNumber || !description) {
          toast.error('Please fill in all required fields');
          setLoading(false);
          return;
        }

        const res = await api.post('/support-requests', {
          guest_name: name,
          email,
          phone,
          room_number: `Room ${roomNumber}`,
          category,
          description,
          urgency
        });

        if (res.data.success) {
          toast.success('Support request submitted successfully! Staff will respond shortly.');
          setName('');
          setEmail('');
          setPhone('');
          setRoomNumber('');
          setDescription('');
        }
      } else {
        // General Inquiry
        if (!name || !email || !subject || !message) {
          toast.error('Please fill in all required fields');
          setLoading(false);
          return;
        }

        // Mock submission for general inquiry
        toast.success('Thank you for your message! We will get back to you shortly.');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      <Toaster position="top-center" richColors />
      <Navbar />
      
      {/* Hero */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-secondary" />
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-5xl font-bold tracking-tight">Contact & <span className="text-gold-gradient">Support</span></h1>
          <p className="text-white/60 mt-4">Get answers to your questions or request room service / maintenance support 24/7.</p>
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
              If you are a guest currently staying at our hotel and require assistance or room maintenance, 
              please submit a support request. For general questions, drop us an inquiry below.
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

              {isAuthenticated && (
                <div className="flex gap-6">
                  <div className="h-14 w-14 bg-accent rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-premium">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-lg">Direct Support / Reception</h4>
                    <p className="text-gray-500 text-sm">Call reception: 0550941056</p>
                    <p className="text-gray-500 text-sm">Customer Care: 0503317207</p>
                    <div className="flex gap-2 mt-3">
                      <a 
                        href="tel:0550941056"
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all"
                      >
                        Call Reception
                      </a>
                      <a 
                        href="tel:0503317207"
                        className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-secondary/90 transition-all"
                      >
                        Call Customer Care
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-6">
                <div className="h-14 w-14 bg-accent rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-premium">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-secondary text-lg">WhatsApp Contact</h4>
                  <p className="text-gray-500 text-sm">Instant messaging chat support: 0503317207</p>
                  <a 
                    href="https://wa.me/233503317207"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 px-5 py-2.5 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition-all shadow-md"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Section */}
            <div className="mt-12 rounded-[32px] overflow-hidden shadow-premium border border-gray-150 h-[320px] relative group card-hover">
              <iframe 
                title="Holy Star Luxury Hotel Location Map"
                src="https://maps.google.com/maps?q=Paradise%20Beach%20Resort,%20Ghana&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[25%] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100 text-xs font-bold text-secondary flex items-center gap-1.5 pointer-events-none">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Holy Star Luxury Hotel</span>
              </div>
            </div>
          </motion.div>

          {/* Form with toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F8F9FA] p-10 md:p-12 rounded-[40px] shadow-sm border border-gray-150 relative overflow-hidden"
          >
            {/* Form Type Toggles */}
            {isAuthenticated ? (
              <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setFormType('inquiry')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    formType === 'inquiry' ? 'bg-secondary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" /> General Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('support')}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    formType === 'support' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Wrench className="h-4 w-4" /> Room Issue & Support
                </button>
              </div>
            ) : (
              <h3 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> General Inquiry
              </h3>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {formType === 'inquiry' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe" 
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com" 
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Inquiry about suite availability" 
                      className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                    <textarea 
                      rows={5} 
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your message here..." 
                      className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Guest Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Michael Chen" 
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Room Number</label>
                      <input 
                        type="text" 
                        required
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="e.g. 204" 
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com" 
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Contact Phone</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+233..." 
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Issue Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm cursor-pointer"
                      >
                        <option value="Maintenance problem">Maintenance problem</option>
                        <option value="Room cleaning request">Room cleaning request</option>
                        <option value="Housekeeping request">Housekeeping request</option>
                        <option value="Electrical issue">Electrical issue</option>
                        <option value="Plumbing issue">Plumbing issue</option>
                        <option value="AC / TV / Wi-Fi not working">AC / TV / Wi-Fi not working</option>
                        <option value="Other complaint">Other complaint / support request</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Urgency Level</label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm cursor-pointer"
                      >
                        <option value="Low">Low (Non-urgent)</option>
                        <option value="Medium">Medium (Standard response)</option>
                        <option value="High">High (Immediate response needed)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Issue Description</label>
                    <textarea 
                      rows={4} 
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue or request in detail..." 
                      className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-sm resize-none"
                    />
                  </div>
                </>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/10 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{formType === 'support' ? 'Submit Support Request' : 'Send Message'} <Send className="h-4 w-4" /></>}
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
