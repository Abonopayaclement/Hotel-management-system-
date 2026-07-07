'use client';

import { useEffect, useState } from 'react';

export type SiteSettings = {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: 'inter' | 'system' | 'georgia';
  fontScale: 'small' | 'base' | 'large';
  hotelName: string;
  brandingText: string;
  hotelPhone: string;
  whatsapp: string;
  hotelEmail: string;
  supportEmail: string;
  hotelAddress: string;
  notificationsEnabled: boolean;
};

export const defaultSiteSettings: SiteSettings = {
  theme: 'light',
  primaryColor: '#B8860B',
  secondaryColor: '#1A237E',
  accentColor: '#E3F2FD',
  fontFamily: 'inter',
  fontScale: 'base',
  hotelName: 'Holy Star Luxury Hotel',
  brandingText: 'Luxury Redefined',
  hotelPhone: '0550941056',
  whatsapp: '0503317207',
  hotelEmail: 'reservations@holystar.com',
  supportEmail: 'support@holystar.com',
  hotelAddress: '123 Luxury Avenue, Paradise Beach, Ghana',
  notificationsEnabled: true
};

const STORAGE_KEY = 'holy-star-site-settings';
export const SITE_SETTINGS_EVENT = 'holy-star-site-settings-updated';

const fontFamilies: Record<SiteSettings['fontFamily'], string> = {
  inter: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  georgia: "Georgia, 'Times New Roman', serif"
};

const fontScales: Record<SiteSettings['fontScale'], string> = {
  small: '15px',
  base: '16px',
  large: '17px'
};

export const loadSiteSettings = (): SiteSettings => {
  if (typeof window === 'undefined') return defaultSiteSettings;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSiteSettings;
    return { ...defaultSiteSettings, ...JSON.parse(stored) };
  } catch {
    return defaultSiteSettings;
  }
};

export const saveSiteSettings = (settings: SiteSettings) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  applySiteSettings(settings);
  window.dispatchEvent(new CustomEvent(SITE_SETTINGS_EVENT, { detail: settings }));
};

export const applySiteSettings = (settings: SiteSettings) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--primary', settings.primaryColor);
  root.style.setProperty('--secondary', settings.secondaryColor);
  root.style.setProperty('--accent', settings.accentColor);
  root.style.setProperty('--color-primary', settings.primaryColor);
  root.style.setProperty('--color-secondary', settings.secondaryColor);
  root.style.setProperty('--color-accent', settings.accentColor);
  root.style.setProperty('--ring', settings.primaryColor);
  root.style.setProperty('--app-font-family', fontFamilies[settings.fontFamily]);
  root.style.setProperty('--app-font-size', fontScales[settings.fontScale]);

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const useDark = settings.theme === 'dark' || (settings.theme === 'auto' && prefersDark);
  root.dataset.theme = useDark ? 'dark' : 'light';
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    const loaded = loadSiteSettings();
    setSettings(loaded);
    applySiteSettings(loaded);

    const handleUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<SiteSettings>;
      setSettings(customEvent.detail || loadSiteSettings());
    };

    window.addEventListener(SITE_SETTINGS_EVENT, handleUpdated);
    return () => window.removeEventListener(SITE_SETTINGS_EVENT, handleUpdated);
  }, []);

  return settings;
};
