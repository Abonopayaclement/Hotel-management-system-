'use client';

import { useEffect } from 'react';
import { applySiteSettings, loadSiteSettings } from '@/lib/siteSettings';

export default function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const settings = loadSiteSettings();
    applySiteSettings(settings);
  }, []);

  return <>{children}</>;
}
