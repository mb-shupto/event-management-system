"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const allEvents = [
  {
    id: 1,
    title: "AI Revolution Seminar",
    type: "seminar",
    date: "2025-08-01",
    time: "10:00 AM - 12:00 PM",
    description: "Explore the future of AI technology with industry experts.",
    location: "Main Auditorium, Dhaka University",
    organizer: "AI Club",
  },
  {
    id: 2,
    title: "Campus Music Fest",
    type: "music show",
    date: "2025-08-10",
    time: "6:00 PM - 9:00 PM",
    description: "Live performances by local bands and artists.",
    location: "Open Ground, Campus",
    organizer: "Music Society",
  },
  {
    id: 3,
    title: "CodeSprint Hackathon",
    type: "hackathon",
    date: "2025-08-15",
    time: "9:00 AM - 9:00 PM",
    description: "24-hour coding challenge for students with cash prizes.",
    location: "Computer Lab, Block C",
    organizer: "Tech Guild",
  },
  {
    id: 4,
    title: "Debate Championship",
    type: "debate",
    date: "2025-08-20",
    time: "2:00 PM - 5:00 PM",
    description: "Compete in a national debate contest on current issues.",
    location: "Seminar Hall, Building A",
    organizer: "Debate Club",
  },
  {
    id: 5,
    title: "Design Workshop",
    type: "workshop",
    date: "2025-08-25",
    time: "1:00 PM - 4:00 PM",
    description: "Learn UI/UX design fundamentals with hands-on practice.",
    location: "Art Room, Campus",
    organizer: "Design Collective",
  },
];

interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  description: string;
  location: string;
  organizer: string;
}

export default function EventDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [myEvents, setMyEvents] = useState<number[]>([]);

  useEffect(() => {
    const foundEvent = allEvents.find((e) => e.id === parseInt(id));
    setEvent(foundEvent || null);
  }, [id]);

  const handleAddToMyEvents = () => {
    if (event && !myEvents.includes(event.id)) {
      setMyEvents((prev) => [...prev, event.id]);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000); // Show success message for 3 seconds
    }
  };

  if (!event) return <div className="p-4 text-red-600">Event not found</div>;

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
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Type:</span> {event.type}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Time:</span> {event.time}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Location:</span> {event.location}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Organizer:</span> {event.organizer}
          </p>
          <p className="text-gray-600">{event.description}</p>
        </div>

        <div className="mt-6 flex space-x-4">
            <button
              onClick={handleAddToMyEvents}
              className="mt-6 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              disabled={myEvents.includes(event.id)}
              aria-label={`Add ${event.title} to My Events`}
            >
              Add to My Events
            </button>
            <button onClick={() => router.back()} className="mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Back</button>
        </div>
        {isAdded && (
          <div className="mt-2 flex items-center text-green-600">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Added to My Events!
          </div>
        )}
      </div>
    </div>
  );
}