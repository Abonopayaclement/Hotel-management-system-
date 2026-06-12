'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, ChevronDown, Star, Utensils } from 'lucide-react';

const RestaurantPage = () => {
  const [activeMenu, setActiveMenu] = useState<'breakfast' | 'lunch' | 'dinner' | 'drinks'>('breakfast');

  const menus = {
    breakfast: [
      { name: 'Continental Breakfast', price: 'GH₵45', description: 'Fresh pastries, cereals, and fruits', image: 'https://images.unsplash.com/photo-1496042399014-dc73c4f2bde1?auto=format&fit=crop&w=500&q=60' },
      { name: 'Eggs Benedict', price: 'GH₵55', description: 'Poached eggs, English muffin, hollandaise sauce', image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&w=500&q=60' },
      { name: 'Full English Breakfast', price: 'GH₵75', description: 'Eggs, bacon, sausage, beans, mushrooms, toast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=60' },
      { name: 'Pancakes with Berries', price: 'GH₵40', description: 'Fluffy pancakes topped with fresh berries', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=500&q=60' },
      { name: 'Avocado Toast', price: 'GH₵35', description: 'Whole grain bread with fresh avocado', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=60' },
      { name: 'Fresh Fruit Bowl', price: 'GH₵30', description: 'Assorted seasonal fresh fruits', image: 'https://images.unsplash.com/photo-1490818387583-1baba5e6382b?auto=format&fit=crop&w=500&q=60' },
    ],
    lunch: [
      { name: 'Grilled Salmon Fillet', price: 'GH₵120', description: 'Fresh salmon with lemon butter sauce', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=60' },
      { name: 'Classic Cheeseburger', price: 'GH₵65', description: 'Angus beef, aged cheddar, caramelized onions', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60' },
      { name: 'Chicken Caesar Wrap', price: 'GH₵55', description: 'Grilled chicken, Caesar dressing, parmesan', image: 'https://images.unsplash.com/photo-1505253716362-afaba1d32418?auto=format&fit=crop&w=500&q=60' },
      { name: 'Seafood Pasta', price: 'GH₵95', description: 'Mixed seafood in creamy tomato sauce', image: 'https://images.unsplash.com/photo-1563379091339-03b21ef4a4f8?auto=format&fit=crop&w=500&q=60' },
      { name: 'Greek Salad', price: 'GH₵45', description: 'Fresh vegetables, feta cheese, olive oil', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=60' },
      { name: 'Steak & Chips', price: 'GH₵150', description: 'Prime ribeye steak with crispy fries', image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=500&q=60' },
    ],
    dinner: [
      { name: 'Filet Mignon', price: 'GH₵180', description: 'Prime cut beef with truffle mash', image: 'https://images.unsplash.com/photo-1546241072-48010ad2862c?auto=format&fit=crop&w=500&q=60' },
      { name: 'Pan-Seared Sea Bass', price: 'GH₵140', description: 'Fresh sea bass with seasonal vegetables', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=60' },
      { name: 'Lobster Tail', price: 'GH₵200', description: 'Butter-poached lobster tail, asparagus', image: 'https://images.unsplash.com/photo-1559742811-82428b49223b?auto=format&fit=crop&w=500&q=60' },
      { name: 'Chicken Marsala', price: 'GH₵110', description: 'Tender chicken in Marsala wine sauce', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=60' },
      { name: 'Rack of Lamb', price: 'GH₵160', description: 'Herb-crusted lamb with rosemary jus', image: 'https://images.unsplash.com/photo-1514516313544-7ed249c2211c?auto=format&fit=crop&w=500&q=60' },
      { name: 'Vegetarian Wellington', price: 'GH₵95', description: 'Puff pastry with mushroom duxelles', image: 'https://images.unsplash.com/photo-1626700051175-6818013e184f?auto=format&fit=crop&w=500&q=60' },
    ],
    drinks: [
      { name: 'Espresso', price: 'GH₵15', description: 'Rich and bold Italian coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=60' },
      { name: 'Cappuccino', price: 'GH₵20', description: 'Creamy cappuccino with artistic foam', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=60' },
      { name: 'Freshly Squeezed Orange Juice', price: 'GH₵25', description: 'Fresh orange juice daily', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=60' },
      { name: 'Tropical Smoothie', price: 'GH₵30', description: 'Mango, pineapple, coconut blend', image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=500&q=60' },
      { name: 'Wine Selection', price: 'GH₵50+', description: 'Curated selection from around the world', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=500&q=60' },
      { name: 'Craft Cocktails', price: 'GH₵60+', description: 'Expert mixologist creations', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=60' },
    ],
  };

  const specialItems = [
    {
      name: "Chef's Special: Pan-Seared Scallops",
      price: 'GH₵160',
      description: 'Fresh scallops with truffle risotto and microgreens',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=500&q=60'
    },
    {
      name: "Signature Chocolate Lava Cake",
      price: 'GH₵35',
      description: 'Warm chocolate cake with molten center and vanilla ice cream',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60'
    },
    {
      name: "Wagyu Beef Burger",
      price: 'GH₵130',
      description: 'Premium Wagyu beef with truffle mayo and aged cheddar',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60'
    },
  ];

  return (
    <main className="bg-[#F8F9FA]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504674900769-e71fada305e0?auto=format&fit=crop&w=1920&q=80")' }}
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            Fine Dining <span className="text-gold-gradient">Experience</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 max-w-xl mx-auto text-lg"
          >
            Indulge in exquisite culinary creations at our award-winning restaurant
          </motion.p>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white p-8 rounded-[32px] shadow-premium text-center">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary mb-2">Opening Hours</h3>
            <p className="text-gray-600 text-sm">Breakfast: 6:00 AM - 11:00 AM</p>
            <p className="text-gray-600 text-sm">Lunch: 12:00 PM - 3:00 PM</p>
            <p className="text-gray-600 text-sm">Dinner: 6:00 PM - 11:00 PM</p>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-premium text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary mb-2">Location</h3>
            <p className="text-gray-600 text-sm">Holy Star Hotel</p>
            <p className="text-gray-600 text-sm">Main Level</p>
            <p className="text-gray-600 text-sm">123 Luxury Avenue</p>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-premium text-center">
            <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary mb-2">Reservations</h3>
            <p className="text-gray-600 text-sm">Phone: 0550941056</p>
            <p className="text-gray-600 text-sm">WhatsApp: 0503317207</p>
            <p className="text-gray-600 text-sm">Available 24/7</p>
          </div>
        </motion.div>
      </section>

      {/* Chef's Specials */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-secondary text-center mb-12"
        >
          Chef's <span className="text-primary">Specials</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[32px] overflow-hidden shadow-premium hover:shadow-xl transition-all card-hover"
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="p-6">
                <p className="text-primary font-bold text-lg mb-2">{item.price}</p>
                <h3 className="text-xl font-bold text-secondary mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Menu Selection */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-secondary text-center mb-12"
        >
          Our <span className="text-primary">Menus</span>
        </motion.h2>

        {/* Menu Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(['breakfast', 'lunch', 'dinner', 'drinks'] as const).map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveMenu(menu)}
              className={`px-8 py-3 rounded-full font-bold transition-all capitalize ${
                activeMenu === menu
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white text-secondary border-2 border-gray-200 hover:border-primary'
              }`}
            >
              {menu}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <motion.div
          key={activeMenu}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {menus[activeMenu].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-premium transition-all border border-gray-50 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-lg">
                  {item.price}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-secondary mb-2">{item.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                <div className="mt-6 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest cursor-pointer hover:gap-3 transition-all">
                  Order Now 
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Restaurant Introduction */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-secondary mb-6">
              Welcome to Our <span className="text-primary">Restaurant</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Our restaurant offers an exquisite dining experience with a carefully curated menu of international and local cuisines. 
              Each dish is prepared with the finest ingredients and passion by our award-winning chef and culinary team.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Whether you're looking for a casual lunch, romantic dinner, or special celebration, 
              our elegant ambiance and impeccable service will make your meal memorable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-secondary to-secondary/80 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Dine?</h2>
          <p className="text-white/80 mb-8">Call us or WhatsApp to make a reservation</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:0550941056"
              className="bg-white text-secondary px-8 py-3 rounded-2xl font-bold hover:bg-white/90 transition-all"
            >
              Call: 0550941056
            </a>
            <a 
              href="https://wa.me/233503317207"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-secondary px-8 py-3 rounded-2xl font-bold hover:bg-white/90 transition-all"
            >
              WhatsApp: 0503317207
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default RestaurantPage;
