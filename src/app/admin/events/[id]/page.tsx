'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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

export default function AdminEventDetail() {
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const eventDoc = await getDoc(doc(db, 'events', id as string));
      if (eventDoc.exists()) {
        setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteDoc(doc(db, 'events', id as string));
      // Redirect to events list
    }
  };

  const handleUpdate = async () => {
    // Update logic here
  };

  if (loading) {
    return <p>Loading event...</p>;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <ProtectedRoute>
      <div>
        <h1>{event.title}</h1>
        <p>Date: {event.date}</p>
        <p>Location: {event.location}</p>
        <p>{event.description}</p>
        <img src={event.imageUrl} alt={event.title} />
        <h2>Ticket Tiers</h2>
        {event.ticketTiers.map((tier) => (
          <div key={tier.name}>
            <p>{tier.name} - ${tier.price} ({tier.total - tier.sold} left)</p>
          </div>
        ))}
        <button onClick={() => setEditing(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </ProtectedRoute>
  );
}