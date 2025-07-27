"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import { useState } from "react";
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon} from "@heroicons/react/24/outline";
import Link from "next/link";

const mockUser = {
  name: "John Doe",
  role: "Student",
  email: "john.doe@example.com",
  joined: "2025-07-01",
  department: "Computer Science",
};

export default function EditProfilePage() {
  const [formData, setFormData] = useState(mockUser);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Name and email are required.");
      return;
    }
    setError(null);
    setSuccess(true);
    console.log("Saved:", { ...formData, joined: new Date() });
    setTimeout(() => setSuccess(false), 3000);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        </div>
      </div>

      <div className="bg-white text-black p-3 rounded-md shadow-md mb-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture Upload */}
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department " className="block text-sm font-medium text-gray-700">Department</label>
            <input type="text" name="department" id="department" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required placeholder="Enter your department" value={formData.department}/>
          </div>

          {/* Error or Success Message */}
          {error && (
            <div className="flex items-center text-red-600">
              <XCircleIcon className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Profile updated successfully!
            </div>
          )}

          {/* Buttons */}
        <div className="flex space-x-4">
            <Link
              href="/user/profile"
              className="flex-1 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 flex items-center justify-center"
              aria-label="Back to Profile"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </Link>
            <button
              type="submit"
              className="flex-1 bg-green-400 text-white p-2 rounded-md hover:bg-green-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}