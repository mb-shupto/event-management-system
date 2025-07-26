'use client';

import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-400 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">Event Management</Link>
        <nav>
          <Link href="/user/login" className="mr-4 text-white hover:text-black">Login</Link>
          <Link href="/user/register" className="text-white hover:text-black">Register</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;