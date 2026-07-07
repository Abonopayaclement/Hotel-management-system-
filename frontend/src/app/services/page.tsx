'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  Dumbbell, 
  Sparkles, 
  Waves, 
  Activity, 
  Gamepad2, 
  MonitorPlay, 
  Wine, 
  Truck, 
  Shirt, 
  HeartPulse, 
  Presentation, 
  Calendar, 
  Clock, 
  FileText, 
  Check, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { toast, Toaster } from 'sonner';

const services = [
  {
    id: 'restaurant',
    name: 'Restaurant & Dining',
    icon: Utensils,
    description: 'Savor gourmet dishes crafted by world-class chefs. Exquisite fine dining and culinary excellence.',
    details: 'Open Daily: 6:30 AM - 11:00 PM. Indoor and outdoor seating available. Reservation recommended.',
    link: '/restaurant',
    bookable: true,
    category: 'dining',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    features: ['Fine Dining Experience', 'Award-Winning International Chefs', 'Curated Wine & Spirits Selection', 'Outdoor Terrace & Private Dining']
  },
  {
    id: 'gym',
    name: 'Gym / Fitness Center',
    icon: Dumbbell,
    description: 'Stay active with our state-of-the-art cardiovascular and strength training equipment.',
    details: 'Open 24/7. Personal trainers available from 6:00 AM to 8:00 PM.',
    link: '/services/gym',
    bookable: true,
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    features: ['State-of-the-Art Equipment', 'Certified Personal Trainers', 'Cardio & Strength Zones', 'Yoga & Stretch Studio']
  },
  {
    id: 'spa',
    name: 'Massage / Spa Center',
    icon: Sparkles,
    description: 'Rejuvenate your body and mind with our therapeutic massages and premium body treatments.',
    details: 'Open Daily: 9:00 AM - 9:00 PM. Prior booking required.',
    link: '/services/spa',
    bookable: true,
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    features: ['Therapeutic Body Massages', 'Rejuvenating Facials & Scrubs', 'Sauna & Steam Room Access', 'Premium Essential Oils']
  },
  {
    id: 'pool',
    name: 'Swimming Pool',
    icon: Waves,
    description: 'Relax by our sparkling, temperature-controlled infinity pool with scenic views.',
    details: 'Open Daily: 6:00 AM - 8:00 PM. Poolside bar and lounge chairs available.',
    link: '/services/pool',
    bookable: true,
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    features: ['Temperature-Controlled Infinity Pool', 'Poolside Bar & Grill', 'Luxury Sun Loungers & Cabanas', 'Kid-Safe Shallow Area']
  },
  {
    id: 'sports',
    name: 'Sports Complex',
    icon: Activity,
    description: 'Enjoy high-energy matches on our premium tennis, squash, and basketball courts.',
    details: 'Open Daily: 7:00 AM - 10:00 PM. Equipment rental available.',
    link: '/services/sports',
    bookable: true,
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1542144574-1b2c451528f8?auto=format&fit=crop&w=1200&q=80',
    features: ['Professional Tennis Courts', 'Indoor Squash & Racquetball', 'Full-Size Basketball Court', 'Premium Gear Rental']
  },
  {
    id: 'indoor_games',
    name: 'Indoor Games / Game Center',
    icon: Gamepad2,
    description: 'Unwind with table tennis, billiards, foosball, and a variety of premium board games.',
    details: 'Open Daily: 10:00 AM - 10:00 PM. Fun for all ages.',
    link: '/services/games',
    bookable: true,
    category: 'entertainment',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    features: ['Billiard & Pool Tables', 'Table Tennis & Foosball', 'Custom Board Game Library', 'Comfortable Lounge Seating']
  },
  {
    id: 'computer_games',
    name: 'Computer Game Center',
    icon: MonitorPlay,
    description: 'Immerse yourself in gaming with high-end PCs, latest consoles, and racing simulators.',
    details: 'Open Daily: 12:00 PM - Midnight. High-speed fiber internet.',
    link: '/services/computer_games',
    bookable: true,
    category: 'entertainment',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    features: ['RTX 4090 Powered PCs', 'PlayStation 5 & Xbox Series X', 'Dual Racing Simulators', 'Gigabit Low-Latency Internet']
  },
  {
    id: 'bar',
    name: 'Bar / Lounge / Club',
    icon: Wine,
    description: 'Experience vibrant nightlife with curated cocktails, premium spirits, and live music.',
    details: 'Open Daily: 5:00 PM - 2:00 AM. DJ sets on weekends.',
    link: '/services/bar',
    bookable: true,
    category: 'dining',
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=80',
    features: ['Curated Craft Cocktails', 'Premium & Rare Spirits Selection', 'Live Jazz & Guest DJ Sets', 'VIP Lounge & Club Area']
  },
  {
    id: 'food_delivery',
    name: 'Food Delivery / Room Service',
    icon: Truck,
    description: 'Order meals, snacks, and drinks directly to your room or suite at any hour.',
    details: 'Available 24/7. Average delivery time: 30 minutes.',
    link: '/restaurant',
    bookable: false,
    category: 'dining',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    features: ['24/7 Room Delivery', 'Secure Heat-Insulated Packaging', 'Complete In-Room Dining Menu', 'Complimentary Breakfast Delivery']
  },
  {
    id: 'laundry',
    name: 'Laundry & Dry Cleaning',
    icon: Shirt,
    description: 'Professional laundry, pressing, and dry cleaning services for your convenience.',
    details: 'Express service available (same-day delivery if dropped off before 10:00 AM).',
    link: '/services/laundry',
    bookable: true,
    category: 'business',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=1200&q=80',
    features: ['Professional Dry Cleaning', 'Same-Day Express Service', 'Delicate Fabric Treatment', 'Stain Removal Experts']
  },
  {
    id: 'clinic',
    name: 'Clinic & Medical Support',
    icon: HeartPulse,
    description: '24/7 on-call medical assistance, first aid, and basic healthcare support.',
    details: 'Resident doctor on-call. Fully equipped emergency support rooms.',
    link: '/services/clinic',
    bookable: true,
    category: 'business',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    features: ['24/7 Doctor On-Call', 'Equipped First Aid & Recovery Rooms', 'Direct Pharmacy Dispatch', 'Emergency Medical Coordination']
  },
  {
    id: 'conference',
    name: 'Conference & Event Spaces',
    icon: Presentation,
    description: 'Host premium corporate meetings, gala events, or private parties in our elegant halls.',
    details: 'State-of-the-art AV equipment, high-speed Wi-Fi, and catering packages available.',
    link: '/services/conference',
    bookable: true,
    category: 'events',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    features: ['Modern Audiovisual Systems', 'Flexible Seating Configurations', 'Full Catering & Host Services', 'High-Speed Wi-Fi & Support']
  }
];

const categories = [
  { id: 'all', name: 'All Services', targetId: 'services-start' },
  { id: 'wellness', name: 'Wellness', targetId: 'service-gym' },
  { id: 'dining', name: 'Dining', targetId: 'service-restaurant' },
  { id: 'entertainment', name: 'Entertainment', targetId: 'service-indoor_games' },
  { id: 'events', name: 'Events', targetId: 'service-conference' },
  { id: 'business', name: 'Business', targetId: 'service-laundry' },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleScrollToCategory = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -150;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (service: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to book a service');
      router.push(`/login?redirect=/services`);
      return;
    }
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error('Please fill in date and time');
      return;
    }

    setBooking(true);
    try {
      const res = await api.post('/service-bookings', {
        service_name: selectedService.name,
        booking_date: date,
        booking_time: time,
        notes: notes
      });

      if (res.data.success) {
        toast.success(`Successfully booked ${selectedService.name}!`);
        setIsModalOpen(false);
        setDate('');
        setTime('');
        setNotes('');
        
        setTimeout(() => {
          router.push('/guest-portal');
        }, 1500);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <main className="bg-[#F8F9FA] min-h-screen">
      <Toaster position="top-center" richColors />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80")' }}
        />
        <div className="absolute inset-0 bg-secondary/70 z-10" />
        <div className="relative z-20 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            Hotel <span className="text-gold-gradient">Services & Amenities</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 max-w-2xl mx-auto text-lg"
          >
            Indulge in premium facilities designed to make your stay extraordinary. 
            From fine dining to revitalizing spa treatments, we offer the peak of luxury.
          </motion.p>
        </div>
      </section>

      {/* Category Navigation Tabs */}
      <div className="sticky top-[73px] z-40 bg-white/90 backdrop-blur-md border-b border-gray-150 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center items-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleScrollToCategory(cat.targetId)}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all bg-gray-50 border border-gray-200 text-secondary hover:bg-primary hover:text-white hover:border-primary cursor-pointer shadow-sm"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Sections */}
      <div id="services-start" className="w-full">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isEven = index % 2 === 0;
          return (
            <section 
              key={service.id}
              id={`service-${service.id}`}
              className={`py-20 border-b border-gray-100 last:border-b-0 ${
                isEven ? 'bg-white' : 'bg-accent/10'
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Image Div */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -45 : 45 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`lg:col-span-6 relative h-[300px] sm:h-[400px] lg:h-[480px] overflow-hidden rounded-[32px] shadow-premium ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-6 left-6">
                      <div className="h-14 w-14 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary shadow-lg">
                        <Icon className="h-7 w-7" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Text/Content Div */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 45 : -45 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`lg:col-span-6 space-y-6 ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div>
                      <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">
                        Holy Star Luxury Services
                      </span>
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary tracking-tight">
                        {service.name}
                      </h2>
                    </div>

                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3 pt-2">
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Amenities & Highlights
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2.5">
                            <div className="h-5 w-5 rounded-full bg-accent/60 flex items-center justify-center text-primary shrink-0">
                              <Check className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-semibold text-secondary">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50/70 border border-gray-150 rounded-2xl">
                      <p className="text-xs text-gray-500 italic leading-relaxed font-medium">
                        {service.details}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
                      {service.bookable ? (
                        <button
                          onClick={() => handleOpenBooking(service)}
                          className="bg-primary text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-primary/95 transition-all shadow-lg hover:shadow-primary/20 cursor-pointer"
                        >
                          Book Service Now
                        </button>
                      ) : service.id === 'food_delivery' ? (
                        <Link
                          href="/restaurant"
                          className="bg-secondary text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-secondary/95 transition-all shadow-lg hover:shadow-secondary/20 cursor-pointer"
                        >
                          Order Dining
                        </Link>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-4 py-2 rounded-full uppercase tracking-wider">
                          Included in Stay
                        </span>
                      )}

                      {service.link && (
                        <Link
                          href={service.link}
                          className="text-secondary hover:text-primary font-bold text-sm transition-colors flex items-center gap-1.5 cursor-pointer py-2 px-3"
                        >
                          Explore Details <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>

                  </motion.div>

                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Booking Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden"
          >
            {/* Background design */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16 blur-2xl" />

            <h3 className="text-3xl font-bold text-secondary mb-2">Book {selectedService.name}</h3>
            <p className="text-gray-500 text-sm mb-8">Schedule your appointment with our professional staff.</p>

            <form onSubmit={handleBookService} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" /> Time
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" /> Special Requests / Notes
                </label>
                <textarea
                  placeholder="Any preferences or medical alerts we should know about..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-secondary rounded-2xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={booking}
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {booking ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Confirm Booking <Check className="h-4 w-4" /></>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Footer />
    </main>
  );
}
