'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Settings, 
  Palette,
  Type,
  Building2,
  Save,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';

const SettingsPage = () => {
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#1E293B');
  const [fontSize, setFontSize] = useState('base');
  const [fontFamily, setFontFamily] = useState('inter');
  const [hotelName, setHotelName] = useState('Holy Star Hotel');
  const [hotelPhone, setHotelPhone] = useState('0550941056');
  const [hotelEmail, setHotelEmail] = useState('reservations@holystar.com');
  const [hotelAddress, setHotelAddress] = useState('123 Luxury Avenue, Paradise Beach, Ghana');

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Settings</h1>
        <p className="text-gray-500 text-sm">Manage application preferences and hotel information.</p>
      </div>

      <div className="space-y-8">
        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[40px] border border-gray-50 p-8 card-hover"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center text-primary">
              <Palette className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-secondary">Appearance</h2>
          </div>

          <div className="space-y-6">
            {/* Theme */}
            <div>
              <label className="block text-sm font-bold text-secondary mb-3">Theme</label>
              <div className="flex gap-4">
                {['light', 'dark', 'auto'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all capitalize ${
                      theme === t
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-secondary mb-3">Primary Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-12 w-12 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-3">Secondary Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-12 w-12 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Typography Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[40px] border border-gray-50 p-8 card-hover"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center text-primary">
              <Type className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-secondary">Typography</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-secondary mb-3">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
              >
                <option value="inter">Inter</option>
                <option value="arial">Arial</option>
                <option value="georgia">Georgia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-secondary mb-3">Font Size</label>
              <div className="flex gap-4">
                {['small', 'base', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all capitalize ${
                      fontSize === size
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hotel Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[40px] border border-gray-50 p-8 card-hover"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-secondary">Hotel Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-secondary mb-3">Hotel Name</label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-secondary mb-3">Phone Number</label>
                <input
                  type="tel"
                  value={hotelPhone}
                  onChange={(e) => setHotelPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-3">Email Address</label>
                <input
                  type="email"
                  value={hotelEmail}
                  onChange={(e) => setHotelEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-secondary mb-3">Address</label>
              <textarea
                value={hotelAddress}
                onChange={(e) => setHotelAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex gap-4 justify-end">
          <button className="px-8 py-4 border-2 border-gray-200 text-secondary rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
            <X className="h-5 w-5" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
