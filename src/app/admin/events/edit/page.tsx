'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';

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
  ticketTiers: TicketTier[];
}

export default function EditEvent() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const { userProfile } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tiers, setTiers] = useState<TicketTier[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const eventDoc = await getDoc(doc(db, 'events', id as string));
      if (eventDoc.exists()) {
        const data = eventDoc.data() as Event;
        setEvent({ ...data, id: eventDoc.id });
        // Pre-fill form
        setTitle(data.title);
        setDate(data.date);
        setLocation(data.location);
        setDescription(data.description);
        setImageUrl(data.imageUrl || '');
        setTiers(data.ticketTiers || []);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  const addTier = () => {
    setTiers([...tiers, { name: 'New Tier', price: 0, total: 50, sold: 0 }]);
  };

  const updateTier = (index: number, field: keyof TicketTier, value: string | number) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  const removeTier = (index: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    try {
      await updateDoc(doc(db, 'events', event.id), {
        title,
        date,
        location,
        description,
        imageUrl: imageUrl || '',
        ticketTiers: tiers,
      });

      alert('Event updated successfully!');
      router.push('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event');
    }
  };

  if (userProfile?.role !== 'organizer' && userProfile?.role !== 'admin') {
    return <div className="text-center py-20 text-white">Access Denied</div>;
  }

  if (loading) {
    return <div className="text-center py-20 text-white">Loading event...</div>;
  }

  if (!event) {
    return <div className="text-center py-20 text-white">Event not found</div>;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">Edit Event</h1>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Same form as create, but pre-filled */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="p-4 border rounded-lg" placeholder="Title" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="p-4 border rounded-lg" />
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="p-4 border rounded-lg" placeholder="Location" />
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="p-4 border rounded-lg" placeholder="Image URL" />
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={6} className="w-full p-4 border rounded-lg" />

            <div>
              <h3 className="text-2xl font-bold mb-4">Ticket Tiers</h3>
              {tiers.map((tier, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 mb-4 items-center">
                  <input type="text" value={tier.name} onChange={(e) => updateTier(index, 'name', e.target.value)} className="p-3 border rounded" />
                  <input type="number" value={tier.price} onChange={(e) => updateTier(index, 'price', parseFloat(e.target.value) || 0)} className="p-3 border rounded" />
                  <input type="number" value={tier.total} onChange={(e) => updateTier(index, 'total', parseInt(e.target.value) || 0)} className="p-3 border rounded" />
                  <button type="button" onClick={() => removeTier(index)} disabled={tiers.length === 1} className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addTier} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                + Add Tier
              </button>
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => router.push('/admin/events')} className="bg-gray-500 text-white px-8 py-4 rounded-lg">
                Cancel
              </button>
              <button type="submit" className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-green-700">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}