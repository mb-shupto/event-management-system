'use client';

import Link from 'next/link';
import Image from 'next/image';
import bLogo from '@/app/logo/event-management-logo-black.png';

export default function PublicNavbar() {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src={bLogo} alt="Event Ticketing Logo" width={50} height={50} />
              <span className="ml-3 text-2xl font-bold text-blue-400">EventHub</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-400 font-medium">Home</Link>
            <Link href="/events" className="text-gray-700 hover:text-blue-400 font-medium">All Events</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-400 font-medium">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-400 font-medium">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <button className="px-6 py-2 text-blue-400 font-semibold border border-blue-400 rounded-lg hover:bg-blue-50 transition">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-2 bg-blue-400 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}