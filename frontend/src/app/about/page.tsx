'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Users, Globe, Compass, ShieldCheck, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
        />
        <div className="absolute inset-0 bg-secondary/70 z-10" />
        <div className="relative z-20 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
          >
            Our <span className="text-gold-gradient font-playfair">Story & Legacy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 max-w-2xl mx-auto font-light text-base md:text-lg"
          >
            Dedicated to providing an unforgettable experience of luxury and authentic hospitality since 1998.
          </motion.p>
        </div>
      </section>

      {/* Our Legacy & Story */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">About Holy Star</span>
            <h2 className="text-4xl font-bold text-secondary mb-8 tracking-tight">
              Redefining the Art of <span className="text-primary italic font-light">Hospitality</span>
            </h2>
            <div className="space-y-6 text-gray-500 leading-relaxed text-sm md:text-base">
              <p>
                Founded on the principles of elegance, comfort, and personalized service, Holy Star 
                Luxury Hotel has grown from a visionary boutique coastal getaway to a global 
                benchmark for luxury hospitality.
              </p>
              <p>
                Our journey began in 1998, born from the desire to create a premium sanctuary where the golden sands of Paradise Beach meet world-class architectural splendor. Our founders envisioned a haven that celebrates local Ghanaian warmth and culture while delivering absolute comfort and luxury.
              </p>
              <p>
                Over the last two decades, we have continuously elevated our standards, integrating cutting-edge guest conveniences with timeless classic design. Whether you are here for a romantic escape, a family holiday, or a premium corporate gathering, every detail of your stay is curated by our dedicated team to make it truly unforgettable.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="flex gap-4">
                <CheckCircle className="text-primary h-6 w-6 shrink-0" />
                <div>
                  <h4 className="font-bold text-secondary">Premium Service</h4>
                  <p className="text-xs text-gray-400 mt-1">24/7 personalized concierge</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="text-primary h-6 w-6 shrink-0" />
                <div>
                  <h4 className="font-bold text-secondary">Luxury Suites</h4>
                  <p className="text-xs text-gray-400 mt-1">Exquisite design & comfort</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden shadow-premium">
              <img 
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" 
                alt="Luxury Hotel Exterior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary p-8 rounded-[32px] shadow-2xl hidden md:block">
              <p className="text-white text-5xl font-bold mb-1">25+</p>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Years of Excellence</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-accent/30 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Our Mission */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[40px] shadow-premium border border-gray-50 flex flex-col justify-between"
            >
              <div>
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                  <Compass className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4">Our Mission</h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                  To provide our guests with an unparalleled retreat of luxury, where heartfelt hospitality, exceptional cuisine, and premium attention to detail combine to produce experiences that resonate for a lifetime.
                </p>
              </div>
            </motion.div>

            {/* Our Vision */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-white p-12 rounded-[40px] shadow-premium border border-gray-50 flex flex-col justify-between"
            >
              <div>
                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                  <Globe className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4">Our Vision</h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                  To remain the leading standard of coastal luxury in West Africa, continually innovating our spaces and guest experience, while remaining steadfastly dedicated to sustainability, cultural authenticity, and excellence.
                </p>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">What Guides Us</span>
          <h2 className="text-4xl font-bold text-secondary tracking-tight">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Excellence",
              desc: "We pursue the highest standards in room upkeep, gourmet cuisine, and flawless service execution.",
              icon: Award
            },
            {
              title: "Genuine Care",
              desc: "We treat every guest with individual attention, warmth, and proactive anticipation of their needs.",
              icon: Heart
            },
            {
              title: "Integrity",
              desc: "Operating ethically and sustainably with complete respect for our community, staff, and environment.",
              icon: ShieldCheck
            },
            {
              title: "Modern Innovation",
              desc: "From smart in-room tech to green energy practices, we consistently evolve to exceed luxury standards.",
              icon: CheckCircle
            }
          ].map((val, idx) => {
            const ValIcon = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-100 p-8 rounded-3xl shadow-premium hover:shadow-lg card-hover"
              >
                <div className="h-12 w-12 bg-accent rounded-xl flex items-center justify-center text-primary mb-6">
                  <ValIcon className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-secondary text-lg mb-3">{val.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{val.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Hospitality & Luxury Showcase */}
      <section className="relative py-28 overflow-hidden bg-secondary text-white">
        <div 
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80")' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Pure Indulgence</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Where Luxury Meets <br/><span className="text-gold-gradient font-playfair">Supreme Comfort</span>
              </h2>
              <p className="text-white/70 mb-8 leading-relaxed text-sm md:text-base">
                Every space at Holy Star Luxury Hotel is designed to inspire tranquility. 
                Our rooms blend rich organic textures with polished modern designs, custom-designed beds, 
                and panoramic views of Paradise Beach. 
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-primary text-3xl font-bold mb-1">99%</h4>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Guest Satisfaction</p>
                </div>
                <div>
                  <h4 className="text-primary text-3xl font-bold mb-1">15+</h4>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">International Awards</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="h-64 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=500&q=80" 
                    alt="Luxury Hotel Room View" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="h-44 bg-primary/25 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-end border border-white/10">
                  <h4 className="font-bold text-white text-lg">Pristine Beach</h4>
                  <p className="text-white/60 text-xs">Direct private access</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-44 bg-white/5 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-end border border-white/10">
                  <h4 className="font-bold text-white text-lg">Fine Dining</h4>
                  <p className="text-white/60 text-xs">Gourmet chef menus</p>
                </div>
                <div className="h-64 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80" 
                    alt="Spa Experience" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;
