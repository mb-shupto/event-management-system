"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import EventCard from "@/components/EventCard";
import UserNavBar from "@/components/UserNavBar";
import { UserCircleIcon, CalendarIcon } from "@heroicons/react/24/outline";

const mockUser = {
  name: "John Doe",
  role: "Student",
  email: "john.doe@example.com",
};

const mockEvents = [
  {
    id: 1,
    title: "AI Seminar",
    type: "Seminar",
    date: "2025-08-01",
    description: "Learn AI advancements.",
  },
  {
    id: 2,
    title: "Campus Concert",
    type: "Concert",
    date: "2025-08-10",
    description: "Live music night.",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <UserNavBar className="mb-2" />
      <div className="mt-2">
        <div className="mb-4 flex items-center">
          <Image
            src={LOGO}
            alt="Event Management System Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
        </div>
        <p className="mb-2">Welcome to your dashboard!</p>
      </div>

      {/* User Profile Summary */}
      <div className="bg-blue-100 text-black p-2 rounded-md shadow-md mb-4">
        <h2 className="text-black font-semibold flex items-center mb-1">
          <UserCircleIcon className="w-6 h-6 mr-2 text-black" />
          Profile Summary
        </h2>
        <p><strong>Name:</strong> {mockUser.name}</p>
        <p><strong>Role:</strong> {mockUser.role}</p>
        <p><strong>Email:</strong> {mockUser.email}</p>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white text-black p-2 rounded-md shadow-md mb-4">
        <h2 className="text-lg font-semibold flex items-center mb-2">
          <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" />
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {mockEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
}