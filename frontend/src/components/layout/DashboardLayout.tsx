'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  ChevronRight,
  UserCircle,
  Briefcase,
  Box,
  ClipboardList,
  Book,
  BrushCleaning,
  BrushCleaningIcon,
  HeadphoneOffIcon,
  HeadphonesIcon,
  DollarSign
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }: any) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
      active 
        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-secondary'
    }`}
  >
    <Icon className={`h-5 w-5 ${active ? 'text-white' : 'group-hover:text-primary transition-colors'}`} />
    {!collapsed && <span className="text-sm font-semibold tracking-wide">{label}</span>}
    {active && !collapsed && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
  </Link>
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: BedDouble, label: 'Rooms', href: '/dashboard/rooms' },
    { icon: Book, label: 'Bookings', href: '/dashboard/bookings' },
    { icon: CalendarCheck, label: 'Reservations', href: '/dashboard/reservations' },
    { icon: Users, label: 'Guests', href: '/dashboard/guests' },
    { icon: Briefcase, label: 'Staff', href: '/dashboard/staff' },
    { icon: BrushCleaningIcon, label: 'Housekeeping', href: '/dashboard/housekeeping' },
    { icon: Box, label: 'Inventory', href: '/dashboard/inventory' },
    { icon: DollarSign, label: 'Finance', href: '/dashboard/finance' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
    { icon: HeadphonesIcon, label: 'Support', href: '/dashboard/support' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside
       onMouseEnter={() => setCollapsed(false)}
       onMouseLeave={() => setCollapsed(true)}
       className={`hidden md:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${
       collapsed ? 'w-24' : 'w-72'
       } fixed top-0 left-0 h-screen overflow-y-auto z-30`}
     >
        <div className="p-8 flex items-center justify-between">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">H</div>
              <span className="text-lg font-bold tracking-tighter text-secondary">HOLY STAR</span>
            </Link>
          )}
          {collapsed && <div className="h-8 w-8 bg-primary rounded-lg mx-auto flex items-center justify-center text-white font-bold">H</div>}
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.href}
              {...item}
              active={pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 text-gray-500 hover:text-danger hover:bg-red-50 rounded-2xl transition-all group"
          >
            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {!collapsed && <span className="text-sm font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
       className={`flex-1 transition-all duration-300 min-w-0 ${
       collapsed ? 'md:ml-24' : 'md:ml-72'
       }`}
       >
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors hidden md:block"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </form>
          </div>

          <div className="flex items-center gap-6">
            
            <Link
              href="/dashboard/notifications"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
             >
             <Bell className="h-5 w-5 text-gray-500" />
             <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
           </Link>
            
            <div className="h-8 w-[1px] bg-gray-100 mx-2" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-secondary leading-none mb-1">{user?.name || 'Abonopaya Clement'}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{user?.role || 'Super Admin'}</p>
              </div>
              <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                <UserCircle className="h-8 w-8" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
