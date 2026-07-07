'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function DeprecatedRevenuePage() {
  useEffect(() => {
    redirect('/dashboard/finance');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-gray-500 font-semibold">Redirecting to the new Finance module...</p>
    </div>
  );
}
