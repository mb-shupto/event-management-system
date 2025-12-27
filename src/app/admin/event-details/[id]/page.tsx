"use client";

import Image from "next/image";
import LOGO from "@/app/logo/logo.png";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function AdminEventDetailPage() {
  const { id } = useParams() as { id: string };
  const [event, setEvent] = useState<Event | null>(null);

  interface Event {
    id: number;
    title: string;
    type: string;
    date: string;
    time: string;
    location: string;
    description: string;
    organizer: string;
  }

  useEffect(() => {
    fetch(`http://localhost:3001/api/events/${id}`)
      .then((response) => response.json())
      .then((data) => setEvent(data))
      .catch((error) => console.error("Error fetching event:", error));
  }, [id]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-white min-h-screen text-black">
      <div className="mt-4">
        <div className="mb-6 flex items-center">
          <Image
            src={LOGO}
            alt="Event Management System Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          <h1 className="text-3xl font-bold text-gray-900">Admin Event Details</h1>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{event.title}</h2>
        <p><strong>Type:</strong> {event.type}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Organizer:</strong> {event.organizer}</p>
        <div className="mt-4">
          <Link href={`/admin/edit-event/${id}`} className="text-green-600 hover:underline mr-4">
            Edit
          </Link>
          <Link href="/admin/events" className="text-blue-600 hover:underline">
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}