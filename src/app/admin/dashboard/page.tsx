'use client';

import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
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
  const { userProfile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="text-center py-20">Loading admin dashboard...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

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
      </div>
    </ProtectedRoute>
  );
}