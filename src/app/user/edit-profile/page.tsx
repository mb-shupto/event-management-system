'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import Image from "next/image";
import LOGO from "@/app/logo/logo.png";
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function EditProfilePage() {
  const { user, userProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    department: userProfile?.department || '',
    // Add more fields as needed
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        // Update more fields as needed
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push('/user/profile');
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Add more fields as needed, e.g., department */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
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
            href="/profile"
            className="flex-1 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 flex items-center justify-center"
            aria-label="Back to Profile"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}