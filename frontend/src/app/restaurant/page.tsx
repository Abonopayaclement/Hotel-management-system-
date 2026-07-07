'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, ChevronDown, Star, Utensils, Loader2, Check, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import api from '@/lib/api';

const RestaurantPage = () => {
  const [activeMenu, setActiveMenu] = useState<'breakfast' | 'lunch' | 'dinner' | 'drinks'>('breakfast');
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Order modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryRoom, setDeliveryRoom] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderType, setOrderType] = useState<'room' | 'external'>('room');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Mobile Money');
  const [paymentNumber, setPaymentNumber] = useState('');

  const handleOpenOrderModal = (item: any) => {
    setSelectedFood(item);
    setQuantity(1);
    setDeliveryRoom('');
    setCustomerName(user?.name || '');
    setCustomerEmail(user?.email || '');
    setCustomerPhone('');
    setDeliveryLocation('');
    setPaymentNumber('');
    setOrderType(isAuthenticated ? 'room' : 'external');
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderType === 'room' && !deliveryRoom) {
      toast.error('Please enter your delivery room number');
      return;
    }
    if (orderType === 'external' && (!customerName || !customerEmail || !customerPhone || !deliveryLocation || !paymentNumber)) {
      toast.error('Please fill in all delivery and payment details');
      return;
    }

    setOrdering(true);
    try {
      const priceVal = parseFloat(selectedFood.price.replace(/[^\d.]/g, ''));
      const subtotal = priceVal * quantity;
      const delivery_fee = orderType === 'external' ? 15 : 0;
      const total_price = subtotal + delivery_fee;
      
      const payload = {
        items: `${quantity}x ${selectedFood.name}`,
        total_price,
        order_type: orderType,
        delivery_room: orderType === 'room' ? `Room ${deliveryRoom}` : null,
        delivery_location: orderType === 'external' ? deliveryLocation : null,
        delivery_fee,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        payment_method: paymentMethod,
        pay_now: orderType === 'external' ? true : false
      };

      const endpoint = isAuthenticated ? '/food-orders' : '/food-orders/public';
      const res = await api.post(endpoint, payload);

      if (res.data.success) {
        toast.success(`Successfully ordered ${quantity}x ${selectedFood.name}!`);
        setIsOrderModalOpen(false);
        setTimeout(() => {
          if (isAuthenticated) {
            router.push('/guest-portal');
          } else {
            toast.info('Thank you! Your delivery order has been placed.');
          }
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setOrdering(false);
    }
  };

  const menus = {
    breakfast: [
      { name: 'Continental Breakfast', price: 'GH₵45', description: 'Fresh pastries, cereals, and fruits', image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=500&q=80' },
      { name: 'Eggs Benedict', price: 'GH₵55', description: 'Poached eggs, English muffin, hollandaise sauce', image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=500&q=80' },
      { name: 'Full English Breakfast', price: 'GH₵75', description: 'Eggs, bacon, sausage, beans, mushrooms, toast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=80' },
      { name: 'Pancakes with Berries', price: 'GH₵40', description: 'Fluffy pancakes topped with fresh berries', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80' },
      { name: 'Avocado Toast', price: 'GH₵35', description: 'Whole grain bread with fresh avocado', image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=500&q=80' },
      { name: 'Fresh Fruit Bowl', price: 'GH₵30', description: 'Assorted seasonal fresh fruits', image: 'https://images.unsplash.com/photo-1519996521430-02b798c1d881?auto=format&fit=crop&w=500&q=80' },
    ],
    lunch: [
      { name: 'Grilled Salmon Fillet', price: 'GH₵120', description: 'Fresh salmon with lemon butter sauce', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=500&q=80' },
      { name: 'Classic Cheeseburger', price: 'GH₵65', description: 'Angus beef, aged cheddar, caramelized onions', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80' },
      { name: 'Chicken Caesar Wrap', price: 'GH₵55', description: 'Grilled chicken, Caesar dressing, parmesan', image: 'https://images.unsplash.com/photo-1626700051175-6818013e184f?auto=format&fit=crop&w=500&q=80' },
      { name: 'Seafood Pasta', price: 'GH₵95', description: 'Mixed seafood in creamy tomato sauce', image: 'https://images.unsplash.com/photo-1563379091339-03b21ef4a4f8?auto=format&fit=crop&w=500&q=80' },
      { name: 'Greek Salad', price: 'GH₵45', description: 'Fresh vegetables, feta cheese, olive oil', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80' },
      { name: 'Steak & Chips', price: 'GH₵150', description: 'Prime ribeye steak with crispy fries', image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=500&q=80' },
    ],
    dinner: [
      { name: 'Filet Mignon', price: 'GH₵180', description: 'Prime cut beef with truffle mash', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80' },
      { name: 'Pan-Seared Sea Bass', price: 'GH₵140', description: 'Pan-seared fresh sea bass, seasonal veggies', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80' },
      { name: 'Lobster Tail', price: 'GH₵200', description: 'Butter-poached lobster tail, asparagus', image: 'https://images.unsplash.com/photo-1559742811-82428b49223b?auto=format&fit=crop&w=500&q=80' },
      { name: 'Chicken Marsala', price: 'GH₵110', description: 'Tender chicken in Marsala wine sauce', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80' },
      { name: 'Rack of Lamb', price: 'GH₵160', description: 'Herb-crusted lamb with rosemary jus', image: 'https://images.unsplash.com/photo-1514516313544-7ed249c2211c?auto=format&fit=crop&w=500&q=80' },
      { name: 'Vegetarian Wellington', price: 'GH₵95', description: 'Puff pastry with mushroom duxelles', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80' },
    ],
    drinks: [
      { name: 'Espresso', price: 'GH₵15', description: 'Rich and bold Italian coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80' },
      { name: 'Cappuccino', price: 'GH₵20', description: 'Creamy cappuccino with artistic foam', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=80' },
      { name: 'Freshly Squeezed Orange Juice', price: 'GH₵25', description: 'Fresh orange juice daily', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80' },
      { name: 'Tropical Smoothie', price: 'GH₵30', description: 'Mango, pineapple, coconut blend', image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c2?auto=format&fit=crop&w=500&q=80' },
      { name: 'Wine Selection', price: 'GH₵50', description: 'Curated selection from around the world', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=500&q=80' },
      { name: 'Craft Cocktails', price: 'GH₵60', description: 'Expert mixologist creations', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=80' },
    ],
  };

  const specialItems = [
    {
      name: "Chef's Special: Pan-Seared Scallops",
      price: 'GH₵160',
      description: 'Fresh scallops with truffle risotto and microgreens',
      image: 'https://images.unsplash.com/photo-1532636875304-0c8fe119ff91?auto=format&fit=crop&w=500&q=80'
    },
    {
      name: "Signature Chocolate Lava Cake",
      price: 'GH₵35',
      description: 'Warm chocolate cake with molten center and vanilla ice cream',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80'
    },
    {
      name: "Wagyu Beef Burger",
      price: 'GH₵130',
      description: 'Premium Wagyu beef with truffle mayo and aged cheddar',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80'
    },
  ];

  return (
    <main className="bg-[#F8F9FA]">
      <Toaster position="top-center" richColors />
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
              className="bg-white rounded-[32px] overflow-hidden shadow-premium hover:shadow-xl transition-all card-hover group"
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-primary font-bold text-lg">{item.price}</p>
                  <button
                    onClick={() => handleOpenOrderModal(item)}
                    className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-primary/95 transition-all shadow-md cursor-pointer"
                  >
                    Order Now
                  </button>
                </div>
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
              className={`px-8 py-3 rounded-full font-bold transition-all capitalize cursor-pointer ${
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
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.description}</p>
                <button
                  onClick={() => handleOpenOrderModal(item)}
                  className="bg-primary text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-primary/95 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <ShoppingBag className="h-4 w-4" /> Order Now
                </button>
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

      {/* Order Modal */}
      {isOrderModalOpen && selectedFood && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16 blur-2xl" />

            <h3 className="text-3xl font-bold text-secondary mb-2">Order Food</h3>
            <p className="text-gray-500 text-sm mb-6">Enter delivery details to place your order.</p>

            {!isAuthenticated && (
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 text-blue-700 text-xs rounded-2xl mb-4 font-semibold text-center leading-relaxed">
                Ordering as Guest. <Link href={`/login?redirect=/restaurant`} className="underline font-bold text-primary">Log in here</Link> for free room delivery!
              </div>
            )}

            {isAuthenticated && (
              <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-150 mb-4 font-sans">
                <button
                  type="button"
                  onClick={() => setOrderType('room')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    orderType === 'room' ? 'bg-secondary text-white shadow-md' : 'text-gray-500 hover:bg-gray-150'
                  }`}
                >
                  Room Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('external')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    orderType === 'external' ? 'bg-secondary text-white shadow-md' : 'text-gray-500 hover:bg-gray-150'
                  }`}
                >
                  External Delivery
                </button>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              <div className="p-4 bg-accent/40 rounded-2xl border border-primary/10 flex items-center gap-4">
                <img src={selectedFood.image} alt={selectedFood.name} className="h-16 w-16 object-cover rounded-xl shrink-0" />
                <div>
                  <h4 className="font-bold text-secondary text-sm">{selectedFood.name}</h4>
                  <p className="text-xs text-gray-500">{selectedFood.price}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Quantity</label>
                  <select 
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                {orderType === 'room' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Room Number</label>
                    <input 
                      type="text" 
                      required 
                      value={deliveryRoom}
                      onChange={(e) => setDeliveryRoom(e.target.value)}
                      placeholder="e.g. 104"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium"
                    />
                  </div>
                )}
              </div>

              {orderType === 'external' && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Customer Name</label>
                    <input 
                      type="text" 
                      required 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone Number</label>
                      <input 
                        type="tel" 
                        required 
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 055094..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Delivery Address</label>
                    <input 
                      type="text" 
                      required 
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      placeholder="Street, City, Landmark"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Payment Method</label>
                      <select 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                      >
                        <option value="Mobile Money">Mobile Money</option>
                        <option value="Visa Card">Visa Card</option>
                        <option value="Mastercard">Mastercard</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Wallet / Card Number</label>
                      <input 
                        type="text" 
                        required 
                        value={paymentNumber}
                        onChange={(e) => setPaymentNumber(e.target.value)}
                        placeholder="024XXXXXX or Card No"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="p-4 bg-accent/30 rounded-2xl border border-primary/5 text-secondary text-sm space-y-1.5 font-sans">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal ({quantity}x)</span>
                  <span>GH₵{(parseFloat(selectedFood.price.replace(/[^\d.]/g, '')) * quantity).toFixed(2)}</span>
                </div>
                {orderType === 'external' && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Delivery Fee</span>
                    <span>GH₵15.00</span>
                  </div>
                )}
                <div className="w-full h-[1px] bg-gray-200/80 my-1" />
                <div className="flex justify-between font-bold text-secondary">
                  <span>Total Amount</span>
                  <span className="text-primary font-bold">
                    GH₵{((parseFloat(selectedFood.price.replace(/[^\d.]/g, '')) * quantity) + (orderType === 'external' ? 15 : 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-secondary rounded-2xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ordering}
                  className="px-8 py-3 bg-primary hover:bg-primary/95 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/15 transition-all flex items-center gap-2"
                >
                  {ordering ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{orderType === 'external' ? 'Pay & Order' : 'Place Order'} <Check className="h-4 w-4" /></>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      <Footer />
    </main>
  );
};

export default RestaurantPage;
