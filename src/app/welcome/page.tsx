'use client';

import PublicNavbar from '@/components/PublicNavbar';
import Footer from '@/components/Footer';
import SubFooter from '@/components/SubFooter';
import CustomCarousel from '@/components/CustomCarousel';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      <PublicNavbar />

      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8">
            Discover Amazing Campus Events
          </h1>
          <p className="text-2xl text-gray-700 mb-12">
            Join thousands of students attending workshops, concerts, talks, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link href="/register">
              <button className="bg-teal-600 text-white px-12 py-6 rounded-full text-2xl font-bold hover:bg-teal-700 shadow-2xl">
                Get Started Free
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-white text-teal-600 border-4 border-teal-600 px-12 py-6 rounded-full text-2xl font-bold hover:bg-teal-50">
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-16">Featured Events</h2>
          <CustomCarousel />
        </div>
      </section>

      <section className="py-24 bg-teal-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-8">Never Miss an Event Again</h2>
          <p className="text-2xl mb-12">Create your free account today and get access to all campus events.</p>
          <Link href="/register">
            <button className="bg-white text-teal-600 px-12 py-6 rounded-full text-2xl font-bold hover:bg-gray-100 shadow-2xl">
              Sign Up Now
            </button>
          </Link>
        </div>
      </section>

      <Footer />
      <SubFooter />
    </div>
  );
}