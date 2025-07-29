"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    type: "seminar",
    date: "",
    time: "",
    location: "",
    description: "",
    organizer: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newEvent = await response.json();
        console.log("Event created successfully:", newEvent);
        router.push("/admin/events");
      } else {
        const errorText = await response.text();
        console.error("Server error:", response.status, errorText);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Network error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              placeholder="Enter event title"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="seminar">Seminar</option>
              <option value="music show">Music Show</option>
              <option value="hackathon">Hackathon</option>
              <option value="debate">Debate</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              id="time"
              name="time"
              type="text"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 10:00 AM - 12:00 PM"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter location"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter event description"
              rows={4}
            />
          </div>
          <div>
            <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
              Organizer
            </label>
            <input
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter organizer name"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}