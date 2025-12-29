'use client';

import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';


interface TicketTier {
  name: string;
  price: number;
  total: number;
  sold: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  ticketTiers?: TicketTier[];
}

export default function AdminEvents() {
  const { userProfile, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tiers, setTiers] = useState<TicketTier[]>([{ name: 'General', price: 10, total: 100, sold: 0 }]);


  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'events'), orderBy('date'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const eventsData: Event[] = [];
          snapshot.forEach((doc) => {
            eventsData.push({ id: doc.id, ...doc.data() } as Event);
          });
          setEvents(eventsData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching events:', err);
          setError('Failed to load events');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up listener:', err);
      setError('Failed to set up event listener');
      setLoading(false);
    }
  }, [user]);

  // const addTier = () => {
  //   setTiers([...tiers, { name: 'New Tier', price: 0, total: 50, sold: 0 }]);
  // };

  // const updateTier = (index: number, field: keyof TicketTier, value: string | number) => {
  //   const newTiers = [...tiers];
  //   newTiers[index] = { ...newTiers[index], [field]: value };
  //   setTiers(newTiers);
  // };

  // const removeTier = (index: number) => {
  //   setTiers(tiers.filter((_, i) => i !== index));
  // };


  // Role check - show early if not authorized
  if (!authLoading && userProfile?.role !== 'organizer' && userProfile?.role !== 'admin') {
    return <p className="text-red-600 p-6">Access Denied: Only organizers and admins can manage events.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'events'), {
        title,
        date,
        location,
        description,
        imageUrl,
        ticketTiers: tiers,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      });

      // Reset form
      setTitle('');
      setDate('');
      setLocation('');
      setDescription('');
      setImageUrl('');
      setTiers([{ name: 'General', price: 10, total: 100, sold: 0 }]);

      alert('Event created successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to create event');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this event? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'events', id));
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6">
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="inline-flex items-center gap-2 rounded-md border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 m-0 mb-4"
          aria-label="Back to Admin Dashboard"
        >
          <span aria-hidden="true" className="font-mono text-base leading-none">
            {"<-"}
          </span>
          <span>Back</span>
        </button>
        <h1 className="text-4xl font-bold text-white mb-8">Admin: Manage Events</h1>

        {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</p>}

        {/* Existing Events */}
        <h2 className="text-3xl font-bold text-black mb-6">Current Events</h2>
        {loading ? (
          <p className="text-black">Loading events...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-blue-400">{event.title}</h3>
                <p className="text-gray-600">{event.date} • {event.location}</p>
                <p className="text-gray-700 mt-2">{event.description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900">Tickets:</h4>
                  {(event.ticketTiers ?? []).length > 0 ? (
                    (event.ticketTiers ?? []).map((tier) => (
                      <p key={tier.name} className="text-sm text-gray-700">
                        {tier.name}: {tier.total - tier.sold} / {tier.total} left
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No ticket tiers available.</p>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/admin/edit-event/${event.id}`)}
                  className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete Event
                </button>
              </div>
            ))}
          </div>
        )}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => router.push("/admin/dashboard")}
                className="inline-flex items-center gap-2 rounded-md border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 m-0 mb-4"
                aria-label="Back to Admin Dashboard"
              >
                <span aria-hidden="true" className="font-mono text-base leading-none">
                  {"<-"}
                </span>
                <span>Back</span>
              </button>
            </div>
        </div>
    </ProtectedRoute>
  );
}