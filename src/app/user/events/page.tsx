"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import { useState } from "react";
import EventCard from "@/components/EventCard";

const allEvents = [
  {
    id: 1,
    title: "AI Revolution Seminar",
    type: "seminar",
    date: "2025-08-01",
    description: "Explore the future of AI technology.",
  },
  {
    id: 2,
    title: "Campus Music Fest",
    type: "music show",
    date: "2025-08-10",
    description: "Live performances by local bands.",
  },
  {
    id: 3,
    title: "CodeSprint Hackathon",
    type: "hackathon",
    date: "2025-08-15",
    description: "24-hour coding challenge for students.",
  },
  {
    id: 4,
    title: "Debate Championship",
    type: "debate",
    date: "2025-08-20",
    description: "Compete in a national debate contest.",
  },
  {
    id: 5,
    title: "Design Workshop",
    type: "workshop",
    date: "2025-08-25",
    description: "Learn UI/UX design fundamentals.",
  },
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredEvents = selectedCategory === "all"
    ? allEvents
    : allEvents.filter((event) => event.type === selectedCategory);

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
          aria-label="Select event category to filter"
        >
          <option value="all">All Categories</option>
          <option value="seminar">Seminar</option>
          <option value="music show">Music Show</option>
          <option value="hackathon">Hackathon</option>
          <option value="debate">Debate</option>
          <option value="workshop">Workshop</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}