"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import Link from "next/link";
import { UserCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

const mockUser = {
  name: "John Doe",
  role: "Student",
  email: "john.doe@example.com",
  gender : "male",
  joined: "2025-07-01",
  department: "Computer Science",
};

export default function ProfilePage() {
  return (
    <div className="p-4">
      <div className="mt-4">
        <div className="mb-4 flex items-center">
          <Image
            src={LOGO}
            alt="Event Management System Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white text-black p-3 rounded-md shadow-md mb-4">
        <div className="flex items-center mb-3">
          <UserCircleIcon className="w-16 h-16 text-gray-400 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">{mockUser.name}</h2>
            <p className="text-gray-600">Joined: {mockUser.joined}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p><strong>Role:</strong> {mockUser.role}</p>
          <p><strong>Email:</strong> {mockUser.email}</p>
        </div>
        <Link
          href="/user/profile/edit"
          className="mt-4 inline-flex items-center bg-blue-400 text-white px-3 py-2 rounded-md hover:bg-blue-700"
        >
          <PencilSquareIcon className="w-5 h-5 mr-2" />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}