"use client";

import Image from "next/image";
import bLogo from "@/app/logo/event-management-logo-black.png";
import Sidebar from "@/components/Sidebar";
import UserNavBar from "@/components/UserNavBar";
import SubFooter from "@/components/SubFooter";
import CustomCarousel from "@/components/CustomCarousel";
import { UserCircleIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Event } from "@/types/events";

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch user info
  useEffect(() => {
    setUserLoading(true);
    fetch("http://localhost:8000/api/users/me", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
        setUserLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
        setUser(null);
        setUserLoading(false);
      });
  }, []);

  // Fetch events
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* User NavBar at the top */}
      <UserNavBar className="mb-2" />

      {/* Main area with Sidebar and Content */}
      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main Content */}
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

          {/* Custom Carousel */}
          <CustomCarousel />

          {/* User Profile Summary */}
          <div className="bg-blue-100 text-black p-4 rounded-md shadow-md mb-4">
            <h2 className="text-black font-semibold flex items-center mb-3">
              <UserCircleIcon className="w-6 h-6 mr-2 text-black" />
              Profile Summary
            </h2>
            {userLoading ? (
              <p>Loading your profile...</p>
            ) : user ? (
              <>
                <p className="text-lg mb-2">
                  Hello <span className="font-bold">{user.name}</span>, welcome to your dashboard!
                </p>
                <div className="space-y-1">
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
              </>
            ) : (
              <p className="text-red-600">User info not available.</p>
            )}
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

      {/* SubFooter at the bottom */}
      <SubFooter />
    </div>
  );
}