"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import SecondNavbar from "@/components/SecondNavbar";
import SubFooter from "@/components/SubFooter";

const mockEvents = [
  { id: 1, title: "AI Seminar", type: "Seminar", date: "2025-08-01", description: "Learn AI advancements." },
  { id: 2, title: "Campus Concert", type: "Concert", date: "2025-08-10", description: "Live music night." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <SecondNavbar></SecondNavbar>
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Image src={LOGO} alt="Event Management System Logo" width={200} height={200} className="mx-auto mb-4" priority />
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Event Management System</h1>
          <p className="mt-4 text-lg text-gray-600">Manage seminars, concerts, contests, and conferences effortlessly.</p>
          <div className="mt-6 space-x-4">
            <a href="/user/login" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">Login</a>
            <a href="/register" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">Register</a>
          </div>
        </div>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockEvents.map((event) => (
              <div key={event.id} className="p-4 border rounded-md shadow-md">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p>Type: {event.type}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Description: {event.description}</p>
                <a href={`/events/${event.id}`} className="text-blue-600 hover:underline mt-2 block">
                  View Details
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SubFooter />
    </div>
  );
}