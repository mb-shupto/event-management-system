"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import Event from "@/types/events";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-white min-h-screen">
      <div className="mt-4">
        <div className="mb-6 flex items-center">
          <Image
            src={LOGO}
            alt="Event Management System Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Link href="/admin/events/create" className="mb-4 inline-block text-blue-600 hover:underline">
          Create New Event
        </Link>
        <div className="mt-4 space-y-4">
          {events.map((event) => (
            <div key={event.id} className="p-4 border rounded-md">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p>Type: {event.type}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <div className="mt-2">
                <Link href={`/admin/events/${event.id}`} className="text-blue-600 hover:underline mr-4">
                  View
                </Link>
                <button className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}