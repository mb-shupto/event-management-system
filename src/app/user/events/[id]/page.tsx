'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';

interface TicketTier {
  name: string;
  price: number;
  total: number;
  sold: number;
}

interface Event {
  id: string;
  title: string;
  type?: string;
  date?: unknown;
  time?: string;
  location?: string;
  description?: string;
  organizer?: string;
  imageUrl?: string;
  ticketTiers?: TicketTier[];
}

function formatEventDate(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const maybeTimestamp = value as { toDate?: () => Date };
  if (typeof maybeTimestamp.toDate === 'function') {
    return maybeTimestamp.toDate().toLocaleDateString();
  }
  return '';
}

export default function UserEventDetail() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      const eventDoc = await getDoc(doc(db, 'events', id as string));
      if (eventDoc.exists()) {
        setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  const handlePurchase = async () => {
    if (!user || !selectedTier || !event) return;
    setPurchaseLoading(true);

    try {
      const eventRef = doc(db, 'events', event.id);
      const userTicketRef = doc(db, 'users', user.uid, 'tickets', `${event.id}_${selectedTier.name}`);

      await runTransaction(db, async (transaction) => {
        const eventSnap = await transaction.get(eventRef);
        if (!eventSnap.exists()) throw new Error('Event does not exist');

        const data = eventSnap.data() as Event;
        const tiers = (data.ticketTiers ?? []) as TicketTier[];
        const tierIndex = tiers.findIndex((t) => t.name === selectedTier.name);

        if (tierIndex === -1) throw new Error('Tier not found');
        if (tiers[tierIndex].sold >= tiers[tierIndex].total) throw new Error('No tickets left');

        const nextTiers = [...tiers];
        nextTiers[tierIndex] = { ...nextTiers[tierIndex], sold: nextTiers[tierIndex].sold + 1 };
        transaction.update(eventRef, { ticketTiers: nextTiers });

        transaction.set(userTicketRef, {
          eventId: event.id,
          eventTitle: data.title ?? event.title,
          date: formatEventDate(data.date ?? event.date),
          location: data.location ?? event.location ?? '',
          tier: selectedTier.name,
          price: selectedTier.price,
          purchaseDate: new Date().toISOString(),
        });
      });

      setSuccess(true);
      setTimeout(() => router.push('/user/my-tickets'), 1200);
    } catch (error) {
  console.error(error);
  setError((error as Error).message || 'An error occurred');
} finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-20 text-white">Loading event...</div>
        ) : !event ? (
          <div className="text-center py-20 text-white">Event not found</div>
        ) : (
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <Image
              src={event.imageUrl || 'https://via.placeholder.com/800x400?text=Event+Image'}
              alt={event.title}
              width={800}
              height={400}
              className="w-full object-cover"
            />

            <div className="p-8">
              <h1 className="text-4xl font-bold text-blue-400 mb-4">{event.title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
                <p>
                  <strong>Date:</strong> {formatEventDate(event.date) || '—'}
                </p>
                <p>
                  <strong>Location:</strong> {event.location || '—'}
                </p>
                {event.time ? (
                  <p>
                    <strong>Time:</strong> {event.time}
                  </p>
                ) : null}
                {event.type ? (
                  <p>
                    <strong>Type:</strong> {event.type}
                  </p>
                ) : null}
              </div>

              {event.description ? <p className="text-gray-800 mb-8">{event.description}</p> : null}

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Ticket</h2>

              {(event.ticketTiers ?? []).length === 0 ? (
                <p className="text-gray-600">No ticket tiers available for this event.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {(event.ticketTiers ?? []).map((tier) => {
                    const remaining = tier.total - tier.sold;
                    return (
                      <button
                        key={tier.name}
                        onClick={() => setSelectedTier(tier)}
                        disabled={remaining <= 0}
                        className={`p-6 rounded-lg border-2 transition-all text-left ${
                          selectedTier?.name === tier.name
                            ? 'border-blue-400 bg-teal-50'
                            : 'border-gray-300 hover:border-teal-400'
                        } ${remaining <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <h3 className="text-xl font-semibold">{tier.name}</h3>
                        <p className="text-3xl font-bold text-blue-400 my-2">${tier.price}</p>
                        <p className="text-sm text-gray-600">{remaining > 0 ? `${remaining} left` : 'Sold Out'}</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedTier ? (
                <div className="text-center">
                  <p className="text-xl mb-4">
                    You selected: <strong>{selectedTier.name}</strong> - ${selectedTier.price}
                  </p>
                  <button
                    onClick={handlePurchase}
                    disabled={purchaseLoading}
                    className="bg-blue-400 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-teal-700 disabled:opacity-50"
                  >
                    {purchaseLoading ? 'Processing...' : 'Complete Purchase'}
                  </button>
                </div>
              ) : null}

              {success ? (
                <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  Purchase successful! Redirecting to My Tickets...
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

function setError(arg0: string) {
  throw new Error('Function not implemented.');
}
