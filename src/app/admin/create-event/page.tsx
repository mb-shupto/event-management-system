"use client";

import Image from "next/image";
import LOGO from "@/app/logo/logo.png";
import { useState } from "react";
import { useRouter } from "next/navigation";


const showToast = (message: string, type: "success" | "error") => {
  const toastElement = document.createElement("div");
  toastElement.className = `fixed bottom-4 right-4 p-3 rounded-md text-white ${type === "success" ? "bg-green-500" : "bg-red-500"}`;
  toastElement.textContent = message;
  document.body.appendChild(toastElement);
  setTimeout(() => document.body.removeChild(toastElement), 3000);
};

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Form data:", { title, date, capacity, type, time, location, description, organizer }); // Debug log
    if (!title || !date || !capacity) {
      setError("Title, date, and capacity are required.");
      showToast("Missing required fields.", "error");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          date,
          time,
          location,
          description,
          organizer,
          capacity: parseInt(capacity) || 0,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showToast("Event created successfully!", "success");
        router.push("/admin/events");
      } else {
        setError(data.message || "Failed to create event.");
        showToast(data.message || "Creation failed.", "error");
      }
    } catch (err: unknown) {
      console.error("Error creating event:", err);
      setError((err as Error).message || "An error occurred. Please try again.");
      showToast("Creation error.", "error");
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-gray-700 text-sm font-medium">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-gray-700 text-sm font-medium">Type</label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-gray-700 text-sm font-medium">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-gray-700 text-sm font-medium">Time</label>
            <input
              type="text"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-700 text-sm font-medium">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 text-black">
            <label htmlFor="description" className="block text-gray-700 text-sm font-medium">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="organizer" className="block text-gray-700 text-sm font-medium">Organizer</label>
            <input
              type="text"
              id="organizer"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="capacity" className="block text-gray-700 text-sm font-medium">Capacity</label>
            <input
              type="number"
              id="capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2.5 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Create Event
          </button>
        </form>
        <a href="/admin/dashboard" className="text-blue-600 hover:underline mt-4 block">
          Back to Admin Dashboard
        </a>
      </div>
    </div>
  );
}