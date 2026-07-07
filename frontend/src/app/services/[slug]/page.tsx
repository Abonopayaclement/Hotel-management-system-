'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  FileText,
  Check,
  ArrowRight,
  Sparkles,
  DollarSign,
  Loader2,
  HelpCircle
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast, Toaster } from 'sonner';

interface ServiceData {
  name: string;
  dbName: string;
  image: string;
  images: string[];
  description: string;
  longDescription: string;
  openingHours: string;
  location: string;
  offers: string[];
  bookable: boolean;
  price: string;
  priceValue: number;
}

const servicesData: Record<string, ServiceData> = {
  gym: {
    name: 'Gym & Fitness Center',
    dbName: 'Gym / Fitness Center',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Stay active with our state-of-the-art cardiovascular and strength training equipment.',
    longDescription: 'Our state-of-the-art fitness center offers everything you need to maintain your workout routine during your stay. Equipped with the latest cardiovascular machines, free weights, resistance equipment, and a spacious stretching area. Professional personal trainers are available to guide you through your routine or create a custom workout plan.',
    openingHours: 'Open 24/7 (Trainers: 6:00 AM - 8:00 PM)',
    location: '2nd Floor, East Wing',
    offers: [
      'Cardio machines (Treadmills, Ellipticals, Bikes)',
      'Free weights and strength machines',
      'Stretching and yoga mats',
      'Complimentary towels and chilled water',
      'Personal training sessions (upon request)'
    ],
    bookable: true,
    price: 'GH₵50 per session',
    priceValue: 50.00
  },
  spa: {
    name: 'Massage & Spa Center',
    dbName: 'Massage / Spa Center',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Rejuvenate your body and mind with our therapeutic massages and premium body treatments.',
    longDescription: 'Escape the stresses of everyday life and enter a haven of tranquility. Our luxury spa offers a wide range of treatment packages, including Swedish massages, deep tissue treatments, body wraps, organic facials, and hot stone therapy. Each session is tailored to your wellness needs by certified practitioners.',
    openingHours: '9:00 AM - 9:00 PM Daily',
    location: 'Ground Floor, Wellness Wing',
    offers: [
      'Swedish Massage (60 / 90 mins)',
      'Deep Tissue Massage (60 / 90 mins)',
      'Aromatherapy & Hot Stone Therapy',
      'Facials and body scrubs',
      'Private saunas and steam rooms'
    ],
    bookable: true,
    price: 'GH₵150 per package',
    priceValue: 150.00
  },
  sports: {
    name: 'Sports Complex',
    dbName: 'Sports Complex',
    image: 'https://images.unsplash.com/photo-1545809074-59472b3f5ecc?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1545809074-59472b3f5ecc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Enjoy high-energy matches on our premium tennis, squash, and basketball courts.',
    longDescription: 'Our sports complex is designed for active guests who enjoy competitive play. We feature championship-size outdoor tennis courts, indoor squash courts, and a multi-purpose court for basketball and volleyball. High-quality rackets, balls, and gear are available for rent, and floodlighting is provided for evening sessions.',
    openingHours: '7:00 AM - 10:00 PM Daily',
    location: 'Outdoor Gardens Area',
    offers: [
      'Professional outdoor tennis courts',
      'Indoor air-conditioned squash courts',
      'Basketball and volleyball facilities',
      'Equipment hire and sports shop',
      'Professional coaching sessions'
    ],
    bookable: true,
    price: 'GH₵80 per hour',
    priceValue: 80.00
  },
  games: {
    name: 'Indoor Games / Game Center',
    dbName: 'Indoor Games / Game Center',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Unwind with table tennis, billiards, foosball, and a variety of premium board games.',
    longDescription: 'Perfect for families and casual gamers, our indoor game center offers hours of entertainment. Features full-size slate pool tables, competition-standard table tennis, fast-paced foosball, and an extensive library of classic and modern board games. A cozy lounge seating area makes it the perfect place to socialize and relax.',
    openingHours: '10:00 AM - 10:00 PM Daily',
    location: '1st Floor, Leisure Zone',
    offers: [
      'Three full-size slate billiards tables',
      'Table tennis and foosball units',
      'Board game library (Chess, Monopoly, Scrabble, etc.)',
      'Refreshment and snack bar',
      'Cozy social lounge seating'
    ],
    bookable: true,
    price: 'GH₵40 per entry',
    priceValue: 40.00
  },
  clinic: {
    name: 'Clinic & Medical Support',
    dbName: 'Clinic',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    ],
    description: '24/7 on-call medical assistance, first aid, and basic healthcare support.',
    longDescription: 'Your safety and health are our priority. Our resident clinic is staffed by certified medical nurses and is equipped with first aid, basic pharmacy, and diagnostic tools. A fully certified medical doctor is on-call 24/7 for consultations or emergency treatment. We also coordinate with local hospitals for advanced care if required.',
    openingHours: '24 Hours / 7 Days a week',
    location: 'Ground Floor, Annex Building',
    offers: [
      'First aid and emergency assistance',
      'Resident nurse on duty, doctor on-call',
      'Basic medical check-ups and diagnostic support',
      'Prescription pick-up coordinate service',
      'Direct link to top-tier local emergency services'
    ],
    bookable: true,
    price: 'GH₵120 per consultation',
    priceValue: 120.00
  },
  conference: {
    name: 'Conference & Event Spaces',
    dbName: 'Conference Halls',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Host premium corporate meetings, gala events, or private parties in our elegant halls.',
    longDescription: 'Host your next event in style. We feature multiple meeting rooms and a grand ballroom that can host up to 500 guests. Fully configurable for corporate presentations, training workshops, weddings, or private dinner banquets. Equipped with state-of-the-art audiovisual setups, laser projectors, and premium conference call technologies.',
    openingHours: 'Available for booked sessions (8:00 AM - Midnight)',
    location: 'Conference Center, West Wing',
    offers: [
      'Grand Ballroom (up to 500 guests capacity)',
      'Executive boardrooms (12 - 30 guests capacity)',
      'State-of-the-art projection & Sound systems',
      'Custom catering and buffet packages',
      'Dedicated event coordinator support'
    ],
    bookable: true,
    price: 'GH₵1500 per booking',
    priceValue: 1500.00
  },
  pool: {
    name: 'Swimming Pool',
    dbName: 'Swimming Pool',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Relax by our sparkling, temperature-controlled infinity pool with scenic views.',
    longDescription: 'Enjoy scenic views and warm sun by our premium infinity pool. Maintained at a perfect temperature throughout the day, the pool area features lounge chairs, parasols, and a poolside towel station. Food and beverage service from our poolside bar is available.',
    openingHours: '6:00 AM - 8:00 PM Daily',
    location: 'Outdoor Terrace, Main Level',
    offers: [
      'Infinity edge with sunset views',
      'Temperature-controlled pool water',
      'Poolside bar serving refreshments',
      'Complimentary sunbeds & clean towels',
      'Children\'s shallow play area'
    ],
    bookable: false,
    price: 'Free for hotel guests',
    priceValue: 0
  },
  computer_games: {
    name: 'Computer Game Center',
    dbName: 'Computer Game Center',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Immerse yourself in gaming with high-end PCs, latest consoles, and racing simulators.',
    longDescription: 'Our computer game center features professional gaming desktops, high-refresh rate displays, standard console booths (PS5, Xbox Series X, Nintendo Switch), and virtual reality setups. Perfectly set up for solo play or local team gaming with ultra-fast internet connections.',
    openingHours: '12:00 PM - Midnight Daily',
    location: '1st Floor, Leisure Zone',
    offers: [
      'High-performance RTX gaming desktops',
      'Latest generation gaming consoles',
      'VR gaming headsets & Simulators',
      'Ergonomic gaming chairs',
      'Local multiplayer tournament support'
    ],
    bookable: false,
    price: 'Free access for guests',
    priceValue: 0
  },
  bar: {
    name: 'Bar / Lounge / Club',
    dbName: 'Bar / Lounge / Club',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Experience vibrant nightlife with curated cocktails, premium spirits, and live music.',
    longDescription: 'Unwind or dance the night away in our chic bar and lounge. Serving craft cocktails mixed by master mixologists, import wine selections, and premium local beers. Featuring relaxing live acoustic sessions on weekdays and energetic DJ sets on Friday and Saturday nights.',
    openingHours: '5:00 PM - 2:00 AM Daily',
    location: 'Lobby level, West Wing',
    offers: [
      'Signature cocktail menu',
      'Exclusive wine & whiskey vault',
      'Vibrant dance floor & DJ booth',
      'Live music and band performances',
      'Chic private lounge booths'
    ],
    bookable: false,
    price: 'Pay per order',
    priceValue: 0
  },
  laundry: {
    name: 'Laundry & Dry Cleaning',
    dbName: 'Laundry',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Professional laundry, pressing, and dry cleaning services for your convenience.',
    longDescription: 'Ensure your garments are always in pristine condition. We offer professional wash, tumble dry, iron press, and organic dry cleaning services. Guest requests placed before 10:00 AM qualify for same-day express delivery.',
    openingHours: '7:00 AM - 7:00 PM Daily',
    location: 'In-room request / Housekeeping pick-up',
    offers: [
      'Eco-friendly dry cleaning options',
      'Professional pressing and starching',
      'Express same-day return service',
      'In-room pickup and delivery',
      'Stain removal treatments'
    ],
    bookable: true,
    price: 'GH₵60 per bag',
    priceValue: 60.00
  }
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const service = servicesData[slug];

  const { isAuthenticated } = useAuthStore();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (slug && !servicesData[slug]) {
      // Unknown service slug
      toast.error('Service page not found.');
    }
  }, [slug]);

  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to book this service');
      router.push(`/login?redirect=/services/${slug}`);
      return;
    }

    if (!date || !time) {
      toast.error('Please select both a date and time');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/service-bookings', {
        service_name: service.dbName,
        booking_date: date,
        booking_time: time,
        notes: notes,
        price: service.priceValue
      });

      if (res.data.success) {
        toast.success(`Successfully booked ${service.name}!`);
        setDate('');
        setTime('');
        setNotes('');
        setTimeout(() => {
          router.push('/guest-portal');
        }, 1500);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to book service. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (!service) {
    return (
      <main className="bg-[#F8F9FA] min-h-screen">
        <Navbar />
        <div className="h-[400px] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">Service Not Found</h1>
          <Link href="/services" className="text-primary hover:underline flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to Services
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-[#F8F9FA] min-h-screen">
      <Toaster position="top-center" richColors />
      <Navbar />

      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-150 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2">
          <Link href="/services" className="flex items-center gap-1 text-primary hover:text-primary/80 transition-all text-sm font-semibold">
            <ChevronLeft className="h-4 w-4" />
            Services
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 text-sm font-semibold">{service.name}</span>
        </div>
      </section>

      {/* Hero Image / Gallery */}
      <section className="relative h-[450px] overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <span className="text-gold-gradient font-bold uppercase text-xs tracking-widest block mb-2">Exclusive Facilities</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{service.name}</h1>
        </div>
      </section>

      {/* Details Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Service Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-premium border border-gray-50">
              <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" /> About the Service
              </h2>
              <p className="text-gray-600 leading-relaxed text-base mb-8">
                {service.longDescription}
              </p>

              {/* What We Offer */}
              <div className="border-t border-gray-150 pt-8">
                <h3 className="text-lg font-bold text-secondary mb-4">What This Service Offers</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.offers.map((offer, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{offer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gallery Images if multiple */}
            {service.images && service.images.length > 1 && (
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-premium border border-gray-50">
                <h2 className="text-2xl font-bold text-secondary mb-6">Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {service.images.map((img, index) => (
                    <div key={index} className="rounded-3xl overflow-hidden h-48 md:h-64 shadow-md">
                      <img src={img} alt={`${service.name} image ${index}`} className="w-full h-full object-cover hover:scale-105 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking / Details Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-premium border border-gray-50 sticky top-24">
              
              {/* Quick Details Cards */}
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-sm">Opening Hours</h4>
                    <p className="text-xs text-gray-500 font-semibold">{service.openingHours}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-sm">Location / Access</h4>
                    <p className="text-xs text-gray-500 font-semibold">{service.location}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center text-primary shrink-0">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-sm">Pricing / Rates</h4>
                    <p className="text-xs text-gray-500 font-bold text-primary">{service.price}</p>
                  </div>
                </div>
              </div>

              {/* Booking Form (If bookable) */}
              {service.bookable ? (
                <div className="border-t border-gray-150 pt-8 space-y-4">
                  <h3 className="font-bold text-secondary text-xl mb-4">Book a Session</h3>
                  
                  <form onSubmit={handleBookService} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Date</label>
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
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Time</label>
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Special Notes</label>
                      <textarea
                        placeholder="Any preferences or comments..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl focus:outline-none focus:border-primary text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {bookingLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Request Booking <ArrowRight className="h-5 w-5" /></>}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="border-t border-gray-150 pt-8 text-center p-4 bg-accent/30 rounded-2xl">
                  <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-bold text-secondary text-sm mb-1">Open Service</h4>
                  <p className="text-xs text-gray-500">This service does not require bookings. Guests can access it directly during opening hours.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
