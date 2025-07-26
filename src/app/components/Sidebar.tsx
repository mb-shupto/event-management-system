'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HomeIcon, CalendarIcon, UserIcon, ArrowRightOnRectangleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`bg-gray-800 text-white h-screen ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
      <div className="flex items-center justify-between p-4">
        <h2 className={`text-xl font-bold ${isOpen ? 'block' : 'hidden'}`}>Event Management</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/user/dashboard"
              className="flex items-center p-4 hover:bg-gray-700"
              aria-label="Go to dashboard"
            >
              <HomeIcon className="w-6 h-6 mr-2" aria-hidden="true" />
              <span className={isOpen ? 'block' : 'hidden'}>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/user/events"
              className="flex items-center p-4 hover:bg-gray-700"
              aria-label="Go to events"
            >
              <CalendarIcon className="w-6 h-6 mr-2" aria-hidden="true" />
              <span className={isOpen ? 'block' : 'hidden'}>Events</span>
            </Link>
          </li>
          <li>
            <Link
              href="/events/create"
              className="flex items-center p-4 hover:bg-gray-700"
              aria-label="Create new event"
            >
              <PlusCircleIcon className="w-6 h-6 mr-2" aria-hidden="true" />
              <span className={isOpen ? 'block' : 'hidden'}>Create Event</span>
            </Link>
          </li>
          <li>
            <Link
              href="/user/profile"
              className="flex items-center p-4 hover:bg-gray-700"
              aria-label="Go to profile"
            >
              <UserIcon className="w-6 h-6 mr-2" aria-hidden="true" />
              <span className={isOpen ? 'block' : 'hidden'}>Profile</span>
            </Link>
          </li>
          <li>
            <button
              onClick={() => alert('Logout clicked')}
              className="flex items-center w-full p-4 hover:bg-gray-700 text-left"
              aria-label="Log out"
              title="Log out"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6 mr-2" aria-hidden="true" />
              <span className={isOpen ? 'block' : 'hidden'}>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;