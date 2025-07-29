"use client";

import EventCard from "@/components/EventCard";
import UserNavBar from "@/components/UserNavBar";
import {  CalendarIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";


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
    description: "Live music night.",
  },
  {
    id: 3,
    title: "CodeSprint Hackathon",
    type: "hackathon",
    date: "2025-08-15",
    description: "24-hour coding challenge for students.",
  },
];

export default function DashboardPage() {
  const [myEvents, setMyEvents] = useState<number[]>([]);

  useEffect(() => {
    // Simulate loading myEvents from localStorage or context (replace with real data)
    const savedEvents = localStorage.getItem("myEvents");
    if (savedEvents) setMyEvents(JSON.parse(savedEvents));
  }, []);

  useEffect(() => {
    // Save myEvents to localStorage (mock persistence)
    localStorage.setItem("myEvents", JSON.stringify(myEvents));
  }, [myEvents]);

  const filteredMyEvents = allEvents.filter((event) => myEvents.includes(event.id));

  return (
    <div>
      <UserNavBar className="mb-2" />
      {/* My Events */}
      <div className="bg-white text-black p-2 rounded-md shadow-md mb-4">
        <h2 className="text-lg font-semibold flex items-center mb-2">
          <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" />
          My Events
        </h2>
        {filteredMyEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredMyEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No events added yet. Check the Events page to add some!</p>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white text-black p-2 rounded-md shadow-md mb-4">
        <h2 className="text-lg font-semibold flex items-center mb-2">
          <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" />
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {allEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
}