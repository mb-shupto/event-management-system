'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/authContext';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';


interface Ticket {
  id: string;
  eventId?: string;
  eventTitle?: string;
  date?: string;
  location?: string;
  tier?: string;
  price?: number;
  purchaseDate?: string;
}

export default function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'tickets'), orderBy('purchaseDate', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next: Ticket[] = [];
        snapshot.forEach((d) => {
          next.push({ id: d.id, ...(d.data() as Omit<Ticket, 'id'>) });
        });
        setTickets(next);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching tickets:', error);
        setTickets([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">My Tickets</h1>
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg mb-4">You haven&apos;t purchased any tickets yet.</p>
            <Link href="/user/events" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 inline-block">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white p-6 rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold text-teal-600 mb-3">{ticket.eventTitle || 'Event Ticket'}</h2>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Date:</strong> {ticket.date || '—'}</p>
                  <p><strong>Location:</strong> {ticket.location || '—'}</p>
                  <p><strong>Ticket:</strong> {ticket.tier || '—'}{typeof ticket.price === 'number' ? ` - $${ticket.price}` : ''}</p>
                  <p><strong>Purchased:</strong> {ticket.purchaseDate || '—'}</p>
                </div>
                <div className="flex justify-center mt-6">
                  <QRCodeSVG value={`TICKET-${ticket.id}`} size={160} level="H" />
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">Show this QR code at entry</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}