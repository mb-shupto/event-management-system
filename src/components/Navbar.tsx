'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/authContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-teal-600 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Event Ticketing</h1>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-yellow-300">Home</Link>
          {user ? (
            <>
              <Link href="/my-events" className="text-white hover:text-yellow-300">My Events</Link>
              <Link href="/my-tickets" className="text-white hover:text-yellow-300">My Tickets</Link>
              <Link href="/dashboard" className="text-white hover:text-yellow-300">Dashboard</Link>
              <button onClick={logout} className="text-white hover:text-yellow-300 bg-red-500 px-3 py-1 rounded">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-white hover:text-yellow-300">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}