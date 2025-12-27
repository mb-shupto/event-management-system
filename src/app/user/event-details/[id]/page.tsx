"use client";

import Image from "next/image";
import LOGO from "@/app/logo/logo.png";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Event } from "@/types/events";

type ToastType = {
  message: string;
  type: "success" | "error";
  duration?: number;
};

const showToast = (message: string, type: "success" | "error") => {
  const toastElement = document.createElement("div");
  toastElement.className = `fixed bottom-4 right-4 p-3 rounded-md text-white ${type === "success" ? "bg-green-500" : "bg-red-500"}`;
  toastElement.textContent = message;
  document.body.appendChild(toastElement);
  setTimeout(() => document.body.removeChild(toastElement), 3000);
};

export default function EventDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isWaitlisted, setIsWaitlisted] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:3001/api/events/${id}`),
      fetch(`http://localhost:3001/api/registrations?userId=1`),
      fetch(`http://localhost:3001/api/waitlist?userId=1`),
    ])
      .then(([eventRes, regRes, waitRes]) =>
        Promise.all([eventRes.json(), regRes.json(), waitRes.json()])
      )
      .then(([eventData, regData, waitData]) => {
        setEvent(eventData);
        setIsRegistered(regData.some((r: Event) => r.id === parseInt(id)));
        setIsWaitlisted(waitData.some((w: Event) => w.id === parseInt(id)));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [id]);

  const handleRegister = async () => {
    if (!event) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, userId: 1 }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.message === "Registered successfully") {
          setIsRegistered(true);
          setIsWaitlisted(false);
          showToast("Registered successfully!", "success");
        } else if (data.message === "Added to waitlist") {
          setIsWaitlisted(true);
          setIsRegistered(false);
          showToast("Added to waitlist!", "success");
        }
      } else {
        showToast(data.message || "Registration failed.", "error");
      }
    } catch (error) {
      console.error("Error registering:", error);
      showToast("Registration error.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading event details...</p>;
  if (!event) return <p className="text-center text-red-600">Event not found.</p>;

  const registeredCount = event.registeredCount ?? 0;
  const capacity = event.capacity ?? 0;

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
        <p><strong>Capacity:</strong> {registeredCount}/{capacity}</p>
        {isRegistered ? (
          <p className="text-green-600 mt-4">You are registered!</p>
        ) : isWaitlisted ? (
          <p className="text-yellow-600 mt-4">You are on the waitlist.</p>
        ) : (
          <button
            onClick={handleRegister}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {registeredCount >= capacity ? "Join Waitlist" : "Register"}
          </button>
        )}
        <a href="/user/events" className="text-blue-600 hover:underline mt-4 block">
          Back to Events
        </a>
      </div>
    </div>
  );
}