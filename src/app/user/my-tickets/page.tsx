'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import ProtectedRoute from '@/components/ProtectedRoute';


interface Ticket {
  id: number;
  eventName: string;
  date: string;
  location: string;
  tier: string;
  price: number;
  purchaseDate: string;
}

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('myTickets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('myTickets', JSON.stringify(tickets));
  }, [tickets]);

  const addMockTicket = () => {
    const newTicket: Ticket = {
      id: Date.now(),
      eventName: 'Tech Summit 2025',
      date: '2025-12-30',
      location: 'Auditorium A',
      tier: 'VIP',
      price: 50,
      purchaseDate: new Date().toLocaleDateString(),
    };
    setTickets([...tickets, newTicket]);
  };

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">My Tickets</h1>
        {tickets.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't purchased any tickets yet.</p>
            <a href="/" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 inline-block">
              Browse Events
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white p-6 rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold text-teal-600 mb-3">{ticket.eventName}</h2>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Date:</strong> {ticket.date}</p>
                  <p><strong>Location:</strong> {ticket.location}</p>
                  <p><strong>Ticket:</strong> {ticket.tier} - ${ticket.price}</p>
                  <p><strong>Purchased:</strong> {ticket.purchaseDate}</p>
                </div>
                <div className="flex justify-center mt-6">
                  <QRCodeSVG value={`TICKET-${ticket.id}`} size={160} level="H" />
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">Show this QR code at entry</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <button
            onClick={addMockTicket}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-medium"
          >
            Add Mock Ticket (Testing)
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}