'use client';

import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
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
  const { userProfile, user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tiers, setTiers] = useState<TicketTier[]>([{ name: 'General', price: 10, total: 100, sold: 0 }]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'events'), orderBy('date'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData: Event[] = [];
      snapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTier = () => {
    setTiers([...tiers, { name: 'New Tier', price: 0, total: 50, sold: 0 }]);
  };

  const updateTier = (index: number, field: keyof TicketTier, value: string | number) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

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
      await deleteDoc(doc(db, 'events', id));
    }
  };

  // Role check
  if (userProfile?.role !== 'organizer' && userProfile?.role !== 'admin') {
    return <p>Access Denied</p>;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">Admin: Manage Events</h1>

        {/* Existing Events */}
        <h2 className="text-3xl font-bold text-black mb-6">Current Events</h2>
        {loading ? (
          <p className="text-black">Loading events...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-teal-600">{event.title}</h3>
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

        {/* Create Event Form (below events) */}
        <div className="bg-white rounded-xl shadow-xl p-6 mt-10 text-gray-900">
          <h2 className="text-xl font-bold text-teal-600 mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="p-2.5 border rounded-lg text-gray-900 placeholder-gray-500"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="p-2.5 border rounded-lg text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="p-2.5 border rounded-lg text-gray-900 placeholder-gray-500"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="p-2.5 border rounded-lg text-gray-900 placeholder-gray-500"
              />
            </div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full p-2.5 border rounded-lg text-gray-900 placeholder-gray-500"
            />

            <div>
              <h3 className="text-lg font-semibold mb-2">Ticket Tiers</h3>
              {tiers.map((tier, index) => (
                <div key={index} className="grid grid-cols-4 gap-3 mb-3 items-center">
                  <input
                    type="text"
                    placeholder="Name (e.g., VIP)"
                    value={tier.name}
                    onChange={(e) => updateTier(index, 'name', e.target.value)}
                    className="p-2 border rounded text-gray-900 placeholder-gray-500"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={tier.price}
                    onChange={(e) => updateTier(index, 'price', parseInt(e.target.value))}
                    className="p-2 border rounded text-gray-900 placeholder-gray-500"
                  />
                  <input
                    type="number"
                    placeholder="Total Tickets"
                    value={tier.total}
                    onChange={(e) => updateTier(index, 'total', parseInt(e.target.value))}
                    className="p-2 border rounded text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeTier(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTier}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Tier
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-teal-700"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}