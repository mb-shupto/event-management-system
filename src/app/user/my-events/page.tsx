"use client";

import Image from "next/image";
import LOGO from "../../Logo/logo.png";
import { useState, useEffect } from "react";
import { Event } from "@/types/events";
import { Toast } from "@/components/Toast";

export default function MyEventsPage() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/api/registrations?userId=1") // Mock userId
      .then((response) => response.json())
      .then((data) => {
        setMyEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching registered events:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-white min-h-screen">
      <div className="mt-4">
        <div className="mb-6 flex items-center">
          <Image
            src={LOGO}
            alt="Event Management System Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          <h1 className="text-3xl font-bold text-gray-900">My Registered Events</h1>
        </div>
      </div>
      {loading ? (
        <p className="text-center text-gray-600">Loading registered events...</p>
      ) : myEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myEvents.map((event) => (
            <div key={event.id} className="p-4 border rounded-md shadow-md bg-white">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <p className="text-gray-600"><strong>Type:</strong> {event.type}</p>
              <p className="text-gray-600"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-600"><strong>Time:</strong> {event.time}</p>
              <p className="text-gray-600"><strong>Location:</strong> {event.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No registered events found.</p>
      )}
      <Toast />
    </div>
  );
}