'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditProfilePage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  const canAccessAdmin = useMemo(
    () => userProfile?.role === 'admin' || userProfile?.role === 'organizer',
    [userProfile?.role],
  );

  const [formData, setFormData] = useState({
    name: '',
    department: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userProfile) return;
    setFormData({
      name: userProfile.name ?? '',
      department: userProfile.department ?? '',
    });
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !canAccessAdmin) return;

    setSaving(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        department: formData.department,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push('/admin/profile');
      }, 3000);
    } catch (error) {
  console.error(error);
  setError((error as Error).message || 'An error occurred');
} finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow p-6 text-gray-900">Loading...</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow p-6 text-gray-900">Profile not found.</div>
      </div>
    );
  }

  if (!canAccessAdmin) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-6 text-gray-900">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-gray-600 mt-1">Only organizers and admins can edit this profile.</p>
            <div className="mt-6">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center rounded-md border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
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
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Admin Profile</h1>
              <p className="text-gray-600 mt-1">Update your display name and department.</p>
            </div>
            <Link
              href="/admin/profile"
              className="inline-flex items-center rounded-md border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              aria-label="Back to Admin Profile"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" aria-hidden="true" />
              Back
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-2">Email is tied to your sign-in account.</p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error ? (
                <div className="flex items-center text-red-600">
                  <XCircleIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  Profile updated successfully!
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/admin/profile"
                  className="sm:flex-1 inline-flex items-center justify-center rounded-md bg-gray-500 text-white px-4 py-2 font-semibold hover:bg-gray-600"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="sm:flex-1 rounded-md bg-green-500 text-white px-4 py-2 font-semibold hover:bg-green-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}