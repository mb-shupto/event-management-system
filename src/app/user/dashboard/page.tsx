"use client";

import Image from "next/image";
import bLogo from "@/app/logo/event-management-logo-black.png";
import Sidebar from "@/components/Sidebar";
import UserNavBar from "@/components/UserNavBar";
import { UserCircleIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Event } from '@/types/events';

const mockUser = {
  name: "John Doe",
  role: "Student",
  email: "john.doe@example.com",
};

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/api/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []); // Empty dependency array to fetch only on mount

  return (
    <div className="flex flex-col h-screen">
      {/* User NavBar at the top */}
      <UserNavBar className="mb-2" />

      {/* Main area with Sidebar and Content */}
      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 ml-16 p-4 overflow-auto"> {/* ml-16 to offset sidebar width when collapsed */}
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
            <p className="mb-2">Welcome to your dashboard!</p>
          </div>

          {/* User Profile Summary */}
          <div className="bg-blue-100 text-black p-2 rounded-md shadow-md mb-4">
            <h2 className="text-black font-semibold flex items-center mb-1">
              <UserCircleIcon className="w-6 h-6 mr-2 text-black" />
              Profile Summary
            </h2>
            <p><strong>Name:</strong> {mockUser.name}</p>
            <p><strong>Role:</strong> {mockUser.role}</p>
            <p><strong>Email:</strong> {mockUser.email}</p>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white text-black p-2 rounded-md shadow-md mb-4">
            <h2 className="text-lg font-semibold flex items-center mb-2">
              <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" />
              Upcoming Events
            </h2>
            {loading ? (
              <p className="text-center text-gray-600">Loading events...</p>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {events.map((event) => (
                  <div key={event.id} className="p-4 border rounded-md shadow-md">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p>Type: {event.type}</p>
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p>Description: {event.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No events available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}