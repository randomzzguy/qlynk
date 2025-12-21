'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Edit, BarChart3, Palette, Settings, LogOut } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: Edit, label: 'My Page' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/themes', icon: Palette, label: 'Themes' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardSidebar({ onSignOut }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card/80 border-r border-border flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center group">
          <img src="/assets/logoWhite.svg" alt="qlynk logo" className="h-10 w-auto" />
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
              pathname === item.href
                ? 'bg-bright-orange text-cream shadow-md'
                : 'text-muted-foreground hover:bg-card hover:text-foreground'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg semi-translucent-button text-cream font-semibold"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}