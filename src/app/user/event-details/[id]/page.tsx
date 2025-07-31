"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Event } from '@/types/events';
import { showToast, Toast } from "@/components/Toast";

export default function EventDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/events/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Event not found");
        return response.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setLoading(false);
      });
  }, [id]);

  const handleAddToMyEvents = async () => {
    if (!event) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/my-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, userId: 1 }), // Mock userId, replace with auth later
      });
      if (response.ok) {
        showToast("Event added to My Events!", "success");
      } else {
        showToast("Failed to add event.", "error");
      }
    } catch (error) {
      console.error("Error adding to My Events:", error);
      showToast("Error adding event.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading event details...</p>;
  if (!event) return <p className="text-center text-red-600">Event not found.</p>;

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
          <h1 className="text-3xl font-bold text-gray-900">Event Details</h1>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">{event.title}</h2>
        <p><strong>Type:</strong> {event.type}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Organizer:</strong> {event.organizer}</p>
        <button
          onClick={handleAddToMyEvents}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          Add to My Events
        </button>
        <a href="/user/events" className="text-blue-600 hover:underline mt-4 block">
          Back to Events
        </a>
      </div>
      <Toast />
    </div>
  );
}