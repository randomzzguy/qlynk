'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, MessageSquare, Settings, LogOut, Bot, FileText } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/agent', icon: Bot, label: 'Configure Agent' },
  { href: '/dashboard/conversations', icon: MessageSquare, label: 'Conversations' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/agent/documents', icon: FileText, label: 'Knowledge Base' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardSidebar({ onSignOut }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card/80 border-r border-border flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center group">
          <Image src="/assets/logoWhite.svg" alt="qlynk logo" width={120} height={40} className="h-10 w-auto" />
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${pathname === item.href
                ? 'bg-bright-orange text-white shadow-md'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
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
