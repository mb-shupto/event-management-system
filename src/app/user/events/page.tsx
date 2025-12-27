'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
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
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  ticketTiers: TicketTier[];
}

export default function EventDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [purchasing, setPurchasing] = useState(false);
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

    setPurchasing(true);

    try {
      const eventRef = doc(db, 'events', event.id);
      const userTicketsRef = doc(db, 'users', user.uid, 'tickets', `${event.id}_${selectedTier.name}`);

      await runTransaction(db, async (transaction) => {
        const eventSnap = await transaction.get(eventRef);
        if (!eventSnap.exists()) throw "Event does not exist";

        const tiers = eventSnap.data().ticketTiers as TicketTier[];
        const tierIndex = tiers.findIndex(t => t.name === selectedTier.name);
        if (tierIndex === -1) throw "Tier not found";
        if (tiers[tierIndex].sold >= tiers[tierIndex].total) throw "No tickets left";

        // Update sold count
        tiers[tierIndex].sold += 1;
        transaction.update(eventRef, { ticketTiers: tiers });

        // Save ticket to user
        transaction.set(userTicketsRef, {
          eventId: event.id,
          eventTitle: event.title,
          date: event.date,
          tier: selectedTier.name,
          price: selectedTier.price,
          purchaseDate: new Date().toISOString(),
        });
      });

      setSuccess(true);
      setTimeout(() => router.push('/my-tickets'), 2000);
    } catch (error: any) {
      alert(error.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-white">Loading event...</div>;
  }

  if (!event) {
    return <div className="text-center py-20 text-white">Event not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <Image
          src={event.imageUrl || 'https://via.placeholder.com/800x400?text=Event+Image'}
          alt={event.title}
          width={800}
          height={400}
          className="w-full object-cover"
        />
        <div className="p-8">
          <h1 className="text-4xl font-bold text-teal-600 mb-4">{event.title}</h1>
          <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
          </div>
          <p className="text-gray-800 mb-8">{event.description}</p>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Ticket</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {event.ticketTiers.map((tier) => {
              const remaining = tier.total - tier.sold;
              return (
                <button
                  key={tier.name}
                  onClick={() => setSelectedTier(tier)}
                  disabled={remaining === 0}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedTier?.name === tier.name
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-300 hover:border-teal-400'
                  } ${remaining === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                  <p className="text-3xl font-bold text-teal-600 my-2">${tier.price}</p>
                  <p className="text-sm text-gray-600">
                    {remaining > 0 ? `${remaining} left` : 'Sold Out'}
                  </p>
                </button>
              );
            })}
          </div>

          {selectedTier && (
            <div className="text-center">
              <p className="text-xl mb-4">
                You selected: <strong>{selectedTier.name}</strong> - ${selectedTier.price}
              </p>
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="bg-teal-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-teal-700 disabled:opacity-50"
              >
                {purchasing ? 'Processing...' : 'Complete Purchase'}
              </button>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Purchase successful! Redirecting to My Tickets...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}