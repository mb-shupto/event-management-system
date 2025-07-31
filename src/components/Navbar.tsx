'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from "@/app/logo/event-management-logo.png";
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <nav className="bg-blue-400 shadow-md sticky top-0 z-50 h-20"> {/* Increased height to h-20 (80px) */}
      <div className="container mx-auto px-4 py-6 flex items-center justify-between"> {/* Increased py-2 to py-6 (24px padding) */}
        <Link href="/" className="text-2xl font-bold text-white flex items-center">
          <Image src={logo} alt="Event Management System Logo" width={50} height={50} className="mr-2" /> {/* Increased logo size */}
          Event Management
        </Link>


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

      </div>
    </nav>
  );
};

export default Navbar;