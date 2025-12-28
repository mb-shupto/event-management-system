'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import bLogo from "@/app/logo/event-management-logo-black.png";
import Sidebar from "@/components/Sidebar";
import UserNavbar from "@/components/UserNavBar";
import SubFooter from "@/components/SubFooter";
import CustomCarousel from "@/components/CustomCarousel";
import { UserCircleIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from "@/lib/authContext";
import Header from '@/components/Header';

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
}

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsList: Event[] = [];
      snapshot.forEach((doc) => {
        eventsList.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(eventsList);
      setLoadingEvents(false);
    }, (error) => {
      console.error('Error fetching events:', error);
      setLoadingEvents(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className=''>
      <Header/>
      <div className="flex flex-col min-h-screen">
        <UserNavbar className="mb-0" />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 ml-16 p-4 overflow-auto">
            <div className="mt-2">
              <div className="mb-4 flex items-center">
                <Image
                  src={bLogo}
                  alt="Event Management System Logo"
                  width={50}
                  height={50}
                  className="mr-2"
                />
                <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
              </div>
              <p className="mb-2 text-black">Welcome to your dashboard!</p>
            </div>
            <CustomCarousel />
            <div className="bg-blue-100 text-black p-4 rounded-md shadow-md mb-4">
              <h2 className="text-black font-semibold flex items-center mb-3">
                <UserCircleIcon className="w-6 h-6 mr-2 text-black" />
                Profile Summary
              </h2>
              {userProfile ? (
                <>
                  <p className="text-lg mb-2">
                    Hello <span className="font-bold">{userProfile.name}</span>, welcome to your dashboard!
                  </p>
                  <div className="space-y-1">
                    <p><strong>Role:</strong> {userProfile.role}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                  </div>
                </>
              ) : (
                <p className="text-red-600">User info not available.</p>
              )}
            </div>
            <div className="bg-white text-black p-2 rounded-md shadow-md mb-4">
              <h2 className="text-lg font-semibold flex items-center mb-2">
                <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" />
                Upcoming Events
              </h2>
              {loadingEvents ? (
                <p className="text-center text-gray-600">Loading events...</p>
              ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 border rounded-md shadow-md hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-semibold text-blue-700">{event.title}</h3>
                      <p className="text-sm text-gray-600"><strong>Type:</strong> {event.type}</p>
                      <p className="text-sm text-gray-600">
                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No upcoming events found.</p>
              )}
            </div>
          </div>
        </div>
        <SubFooter />
      </div>
    </div>
  );
}