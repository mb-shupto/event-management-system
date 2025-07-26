'use client';

import Link from 'next/link';
import Image from 'next/image';
import LOGO from '@/app/Logo/logo.png';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    alert('Logout clicked'); // Replace with actual logout logic
  };

  return (
    <nav className="bg-blue-400 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white flex items-center">
          <Image src={LOGO} alt="Event Management System Logo" width={40} height={40} className="mr-2" />
          Event Management
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white hover:text-blue-600">Home</Link>
          <Link href="/user/events" className="text-white hover:text-blue-600">Events</Link>
          {typeof window !== 'undefined' && window.location.pathname.startsWith('/user') ? (
            <>
              <Link href="/user/dashboard" className="text-white hover:text-blue-600">Dashboard</Link>
              <button onClick={handleLogout} className="text-white hover:text-blue-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/user/login" className="text-white hover:text-blue-600">Login</Link>
              <Link href="/register" className="text-white hover:text-blue-600">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md">
            <div className="flex flex-col items-center space-y-4 py-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</Link>
              <Link href="/user/events" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Events</Link>
              {typeof window !== 'undefined' && window.location.pathname.startsWith('/user') ? (
                <>
                  <Link href="/user/dashboard" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-gray-700 hover:text-blue-600">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/user/login" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link href="/register" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;