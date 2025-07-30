"use client";

import Image from "next/image";
import LOGO from "../../Logo/logo.png";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Event } from '@/types/events';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const filteredEvents = selectedCategory === "all"
    ? events
    : events.filter((event) => event.type === selectedCategory);

  const isAdmin = false; // Mock non-admin user

  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-white min-h-screen text-black">
      <div className="mt-4">
        <div className="mb-6 flex items-center">
          <Image
            src={LOGO}
            alt="Event Management System Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          disabled={loading}
        >
          <option value="all">All Categories</option>
          <option value="seminar">Seminar</option>
          <option value="music show">Music Show</option>
          <option value="hackathon">Hackathon</option>
          <option value="debate">Debate</option>
          <option value="workshop">Workshop</option>
        </select>
      </div>

      {isAdmin && (
        <div className="mb-6">
          <Link href="/admin/events/create">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Add Events
            </button>
          </Link>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading events...</p>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-4 border rounded-md shadow-md">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p>Type: {event.type}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Time: {event.time}</p>
              <p>Location: {event.location}</p>
              <p>Description: {event.description}</p>
              <p>Organizer: {event.organizer}</p>
              <Link href={`/user/event-details/${event.id}`} className="text-blue-600 hover:underline mt-2 block">
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No events available.</p>
      )}
    </div>
  );
}