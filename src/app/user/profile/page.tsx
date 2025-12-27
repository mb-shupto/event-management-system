'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import Image from 'next/image';
import LOGO from "@/app/logo/logo.png";
import { UserCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import UserNavBar from "@/components/UserNavBar";

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      setLoading(false);
    }
  }, [userProfile]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!userProfile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div>
      <nav> <UserNavBar className="mb-2" /></nav> 
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
              <h2 className="text-xl font-semibold">{userProfile.name}</h2>
              <p className="text-gray-600">Joined: {new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Role:</strong> {userProfile.role}
            </p>
            <p>
              <strong>Email:</strong> {userProfile.email}
            </p>
          </div>
          <div className="mt-4 flex center gap-1">
            <Link
              href="/user/edit-profile"
              className="mt-4 inline-flex items-center bg-blue-400 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
              <PencilSquareIcon className="w-5 h-5 mr-2" />
              Edit Profile
            </Link>
            <a href="/user/dashboard"><button className="mt-4 inline-flex items-center bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700">
              Back
            </button></a>
          </div>
        </div>
      </div>
    </div>
  );
}