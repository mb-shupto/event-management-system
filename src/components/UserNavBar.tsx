'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import bLogo from '@/app/logo/event-management-logo-black.png';
import { useAuth } from '@/lib/authContext';

type UserNavBarProps = {
  className?: string;
};

type NavItem = {
  label: string;
  href: string;
};

export default function UserNavBar({ className }: UserNavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const items: NavItem[] = useMemo(
    () => [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Events', href: '/user/events' },
      { label: 'My Events', href: '/user/my-events' },
      { label: 'My Tickets', href: '/user/my-tickets' },
      { label: 'Profile', href: '/user/profile' },
    ],
    [],
  );

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className={`bg-white shadow-lg sticky top-0 z-50 ${className ?? ''}`.trim()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center" aria-label="Go to Dashboard">
              <Image src={bLogo} alt="Event Ticketing Logo" width={50} height={50} />
              <span className="ml-3 text-2xl font-bold text-blue-400">EventHub</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition ${
                    active ? 'text-blue-400' : 'text-gray-700 hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-2 bg-blue-400 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { UserNavBar };