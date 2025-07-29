import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Event Management System',
  description: 'Manage seminars, concerts, contests, and conferences on campus.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showSidebar = typeof window !== 'undefined' && window.location.pathname.startsWith('/user');

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar></Navbar>
        <div className="flex flex-1">
          {showSidebar && (
            <aside className="w-64 bg-[#232f3e] text-white p-4 min-h-screen fixed">
              <Sidebar />
            </aside>
          )}
          <main className={`flex-1 p-0 ${showSidebar ? 'ml-64' : ''}`}>
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}