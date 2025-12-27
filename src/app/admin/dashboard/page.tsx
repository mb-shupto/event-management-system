'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Event {
  id: string;
  title: string;
  date: string;
  ticketTiers?: TicketTier[];
}

interface TicketTier {
  name: string;
  price: number;
  total: number;
  sold: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const { userProfile, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [createForm, setCreateForm] = useState({
    title: '',
    type: '',
    date: '',
    location: '',
    description: '',
    imageUrl: '',
    tierName: 'General',
    tierPrice: '0',
    tierTotal: '100',
  });

  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const eventsQ = query(collection(db, 'events'), orderBy('date'));
    const unsubscribeEvents = onSnapshot(eventsQ, (snapshot) => {
      const eventsList: Event[] = [];
      snapshot.forEach((doc) => {
        eventsList.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(eventsList);
    });

    const usersQ = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(usersQ, (snapshot) => {
      const usersList: User[] = [];
      snapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() } as User);
      });
      setUsers(usersList);
      setLoading(false);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeUsers();
    };
  }, []);

  const canAccessAdmin = useMemo(() => {
    return userProfile?.role === 'admin' || userProfile?.role === 'organizer';
  }, [userProfile?.role]);

  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!user) {
      setCreateError('You must be logged in to create events.');
      return;
    }

    if (!createForm.title || !createForm.date || !createForm.location) {
      setCreateError('Title, date, and location are required.');
      return;
    }

    const tierPrice = Number(createForm.tierPrice);
    const tierTotal = Number(createForm.tierTotal);
    if (!Number.isFinite(tierPrice) || tierPrice < 0 || !Number.isFinite(tierTotal) || tierTotal <= 0) {
      setCreateError('Ticket tier price must be >= 0 and total must be > 0.');
      return;
    }

    setIsCreating(true);
    try {
      await addDoc(collection(db, 'events'), {
        title: createForm.title,
        type: createForm.type,
        date: createForm.date,
        location: createForm.location,
        description: createForm.description,
        imageUrl: createForm.imageUrl,
        ticketTiers: [
          {
            name: createForm.tierName || 'General',
            price: tierPrice,
            total: tierTotal,
            sold: 0,
          },
        ],
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      });

      setIsCreateModalOpen(false);
      setCreateForm({
        title: '',
        type: '',
        date: '',
        location: '',
        description: '',
        imageUrl: '',
        tierName: 'General',
        tierPrice: '0',
        tierTotal: '100',
      });
  } catch (error) {
    console.error(error);
    setCreateError((error as Error).message || 'An error occurred');
  } finally {
    setIsCreating(false);
  }
};

  const salesData = {
    labels: events.map(e => e.title),
    datasets: [
      {
        label: 'Tickets Sold',
        data: events.map(e => e.ticketTiers ? e.ticketTiers.reduce((sum, t) => sum + t.sold, 0) : 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Revenue ($)',
        data: events.map(e => e.ticketTiers ? e.ticketTiers.reduce((sum, t) => sum + (t.sold * t.price), 0) : 0),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const userRolesData = {
    labels: ['Students', 'Organizers', 'Admins'],
    datasets: [
      {
        data: [
          users.filter(u => u.role === 'student').length,
          users.filter(u => u.role === 'organizer').length,
          users.filter(u => u.role === 'admin').length,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const salesOptions = { responsive: true, plugins: { legend: { position: 'top' as const } } };
  const rolesOptions = { responsive: true, plugins: { title: { display: true, text: 'User Roles' } } };

  if (authLoading || loading) {
    return <div className="text-center py-20">Loading admin dashboard...</div>;
  }

  if (!canAccessAdmin) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-gray-600">This page is available to organizers/admins only.</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                setCreateError(null);
                setIsCreateModalOpen(true);
              }}
              className="w-full md:w-56 bg-teal-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-teal-700"
            >
              Create Events
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/events')}
              className="w-full md:w-56 bg-white border border-gray-300 text-gray-800 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 disabled:opacity-50"
            >
              View Events
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Ticket Sales</h2>
            <Bar data={salesData} options={salesOptions} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">User Roles</h2>
            <Pie data={userRolesData} options={rolesOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Recent Events</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Sold</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.ticketTiers ? event.ticketTiers.reduce((sum, t) => sum + t.sold, 0) : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">User Records</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isCreateModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Create event modal"
          >
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-xl font-bold">Create Event</h3>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
                {createError && (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
                    {createError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                      name="title"
                      type="text"
                      value={createForm.title}
                      onChange={handleCreateChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Event title"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Type</label>
                    <input
                      name="type"
                      type="text"
                      value={createForm.type}
                      onChange={handleCreateChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Seminar, Workshop, ..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Date</label>
                    <input
                      name="date"
                      type="date"
                      value={createForm.date}
                      onChange={handleCreateChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <input
                      name="location"
                      type="text"
                      value={createForm.location}
                      onChange={handleCreateChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Hall A, Campus"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Image URL</label>
                  <input
                    name="imageUrl"
                    type="url"
                    value={createForm.imageUrl}
                    onChange={handleCreateChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={createForm.description}
                    onChange={handleCreateChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Describe the event"
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-bold mb-3">Ticket Tier</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Tier Name</label>
                      <input
                        name="tierName"
                        type="text"
                        value={createForm.tierName}
                        onChange={handleCreateChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Price</label>
                      <input
                        name="tierPrice"
                        type="number"
                        value={createForm.tierPrice}
                        onChange={handleCreateChange}
                        min={0}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Total Tickets</label>
                      <input
                        name="tierTotal"
                        type="number"
                        value={createForm.tierTotal}
                        onChange={handleCreateChange}
                        min={1}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 bg-white border border-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50"
                  >
                    {isCreating ? 'Creating…' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
