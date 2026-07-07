'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Settings, 
  Palette,
  Type,
  Building2,
  Save,
  X,
  Phone,
  MessageCircle,
  Mail,
  Bell,
  HelpCircle,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { loadSiteSettings, saveSiteSettings, defaultSiteSettings } from '@/lib/siteSettings';

const SettingsPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [primaryColor, setPrimaryColor] = useState('#B8860B');
  const [secondaryColor, setSecondaryColor] = useState('#1A237E');
  const [accentColor, setAccentColor] = useState('#E3F2FD');
  const [fontSize, setFontSize] = useState<'small' | 'base' | 'large'>('base');
  const [fontFamily, setFontFamily] = useState<'inter' | 'system' | 'georgia'>('inter');
  const [hotelName, setHotelName] = useState('Holy Star Luxury Hotel');
  const [brandingText, setBrandingText] = useState('Luxury Redefined');
  const [hotelPhone, setHotelPhone] = useState('0550941056');
  const [whatsapp, setWhatsapp] = useState('0503317207');
  const [hotelEmail, setHotelEmail] = useState('reservations@holystar.com');
  const [supportEmail, setSupportEmail] = useState('support@holystar.com');
  const [hotelAddress, setHotelAddress] = useState('123 Luxury Avenue, Paradise Beach, Ghana');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const s = loadSiteSettings();
    setTheme(s.theme);
    setPrimaryColor(s.primaryColor);
    setSecondaryColor(s.secondaryColor);
    setAccentColor(s.accentColor);
    setFontSize(s.fontScale);
    setFontFamily(s.fontFamily);
    setHotelName(s.hotelName);
    setBrandingText(s.brandingText);
    setHotelPhone(s.hotelPhone);
    setWhatsapp(s.whatsapp);
    setHotelEmail(s.hotelEmail);
    setSupportEmail(s.supportEmail);
    setHotelAddress(s.hotelAddress);
    setNotificationsEnabled(s.notificationsEnabled);
  }, []);

  const handleSave = () => {
    const updatedSettings = {
      theme,
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
      fontScale: fontSize,
      hotelName,
      brandingText,
      hotelPhone,
      whatsapp,
      hotelEmail,
      supportEmail,
      hotelAddress,
      notificationsEnabled
    };
    saveSiteSettings(updatedSettings);
    toast.success('Settings saved and applied successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setTheme(defaultSiteSettings.theme);
      setPrimaryColor(defaultSiteSettings.primaryColor);
      setSecondaryColor(defaultSiteSettings.secondaryColor);
      setAccentColor(defaultSiteSettings.accentColor);
      setFontSize(defaultSiteSettings.fontScale);
      setFontFamily(defaultSiteSettings.fontFamily);
      setHotelName(defaultSiteSettings.hotelName);
      setBrandingText(defaultSiteSettings.brandingText);
      setHotelPhone(defaultSiteSettings.hotelPhone);
      setWhatsapp(defaultSiteSettings.whatsapp);
      setHotelEmail(defaultSiteSettings.hotelEmail);
      setSupportEmail(defaultSiteSettings.supportEmail);
      setHotelAddress(defaultSiteSettings.hotelAddress);
      setNotificationsEnabled(defaultSiteSettings.notificationsEnabled);
      toast.info('Form fields reset. Click Save changes to apply.');
    }
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" richColors />
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-secondary tracking-tight mb-2">Settings</h1>
        <p className="text-gray-500 text-sm">Manage application preferences, theme colors, typography, and hotel information.</p>
      </div>

      <div className="space-y-8">
        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[40px] border border-gray-100 p-8 card-hover shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center text-primary border border-primary/10">
              <Palette className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-secondary">Appearance & Colors</h2>
          </div>

          <div className="space-y-6">
            {/* Theme */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Theme Mode</label>
              <div className="flex gap-4">
                {(['light', 'dark', 'auto'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all capitalize cursor-pointer text-sm ${
                      theme === t
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Primary Brand Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-12 w-12 rounded-xl cursor-pointer border border-gray-200"
                  />
                  <span className="text-sm font-semibold text-secondary">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Secondary Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-12 w-12 rounded-xl cursor-pointer border border-gray-200"
                  />
                  <span className="text-sm font-semibold text-secondary">{secondaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Accent Overlay Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-12 w-12 rounded-xl cursor-pointer border border-gray-200"
                  />
                  <span className="text-sm font-semibold text-secondary">{accentColor}</span>
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
          className="bg-white rounded-[40px] border border-gray-100 p-8 card-hover shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center text-primary border border-primary/10">
              <Type className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-secondary">Typography Preferences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-xl focus:outline-none focus:border-primary text-sm font-medium cursor-pointer"
              >
                <option value="inter">Inter (Modern & Clean)</option>
                <option value="system">System UI (Default Native)</option>
                <option value="georgia">Georgia (Classic Serif)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Global Font Size Scale</label>
              <div className="flex gap-4">
                {(['small', 'base', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFontSize(size)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all capitalize cursor-pointer text-sm ${
                      fontSize === size
                        ? 'bg-primary text-white shadow-md'
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

        {/* Hotel Information Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[40px] border border-gray-100 p-8 card-hover shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center text-primary border border-primary/10">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-secondary">Hotel & Branding Details</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Hotel Name</label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-xl focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Branding Slogan / Tagline</label>
                <input
                  type="text"
                  value={brandingText}
                  onChange={(e) => setBrandingText(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-xl focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> General Phone
                </label>
                <input
                  type="tel"
                  value={hotelPhone}
                  onChange={(e) => setHotelPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-xl focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Support
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-xl focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Reservations Email
                </label>
                <input
                  type="email"
                  value={hotelEmail}
                  onChange={(e) => setHotelEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-xl focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5" /> Customer Care Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-xl focus:outline-none focus:border-primary text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" /> Business Location Address
              </label>
              <textarea
                value={hotelAddress}
                onChange={(e) => setHotelAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-150 rounded-xl focus:outline-none focus:border-primary text-sm resize-none font-medium"
              />
            </div>
          </div>
        </motion.div>

        {/* Notifications & System Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-[40px] border border-gray-100 p-8 card-hover shadow-sm"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center text-primary border border-primary/10">
              <Bell className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-secondary">System Settings</h2>
          </div>

          <div className="space-y-6">
            <label className="flex items-center gap-3.5 cursor-pointer hover:text-primary transition-colors text-sm font-semibold text-secondary">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="rounded border-gray-350 text-primary focus:ring-primary h-5 w-5"
              />
              <span>Enable Browser Notification Alerts (Reservations & Invoices)</span>
            </label>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button 
            type="button"
            onClick={handleReset}
            className="px-8 py-4 border-2 border-gray-200 hover:border-red-200 text-secondary hover:text-danger rounded-2xl font-bold hover:bg-red-50/50 transition-all flex items-center gap-2 cursor-pointer text-sm"
          >
            <X className="h-5 w-5" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all flex items-center gap-2 cursor-pointer text-sm"
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
