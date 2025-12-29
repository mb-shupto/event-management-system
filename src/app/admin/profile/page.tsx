'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAuth } from '@/lib/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PencilSquareIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function AdminProfilePage() {
  const { userProfile, loading } = useAuth();

  const canAccessAdmin = useMemo(
    () => userProfile?.role === 'admin' || userProfile?.role === 'organizer',
    [userProfile?.role],
  );

  if (loading) {
    return <div className="p-6 text-gray-700">Loading profile...</div>;
  }

  if (!userProfile) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow p-6 text-gray-900 max-w-2xl">
          <h1 className="text-2xl font-bold">Admin Profile</h1>
          <p className="text-gray-600 mt-1">No profile found for this account.</p>
          <div className="mt-6">
            <Link
              href="/admin/login"
              className="inline-flex items-center rounded-md bg-blue-400 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Go to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!canAccessAdmin) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-6 text-gray-900 max-w-2xl">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-gray-600 mt-1">Only organizers and admins can view this page.</p>
            <div className="mt-6">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center rounded-md border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-400 hover:bg-blue-50"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
              <p className="text-gray-600 mt-1">Manage your admin account details.</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center rounded-md border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-400 hover:bg-blue-50"
              >
                Back
              </Link>
              <Link
                href="/admin/profile/edit"
                className="inline-flex items-center rounded-md bg-blue-400 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <PencilSquareIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-gray-900">
            <div className="flex items-start gap-4">
              <UserCircleIcon className="w-16 h-16 text-gray-400" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold truncate">{userProfile.name}</h2>
                <p className="text-gray-600 mt-1">{userProfile.email}</p>
                <p className="text-gray-600 mt-1">Role: {userProfile.role}</p>
                {userProfile.department ? (
                  <p className="text-gray-600 mt-1">Department: {userProfile.department}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}