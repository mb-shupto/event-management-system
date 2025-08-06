"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import Link from "next/link";

export default function AdminDashboard() {
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Your System</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/admin/events" className="text-blue-600 hover:underline">
              Manage Events
            </Link>
          </li>
          <li>
            <Link href="/admin/create-event" className="text-blue-600 hover:underline">
              Create New Event
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}