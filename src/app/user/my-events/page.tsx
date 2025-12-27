'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface SavedEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  addedDate: string;
}

export default function MyEvents() {
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>(() => {
    const saved = localStorage.getItem('myEvents');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('myEvents', JSON.stringify(savedEvents));
  }, [savedEvents]);

  const addMockEvent = () => {
    const newEvent: SavedEvent = {
      id: Date.now(),
      title: 'AI Workshop',
      date: '2025-12-28',
      location: 'Lab 301',
      addedDate: new Date().toLocaleDateString(),
    };
    setSavedEvents([...savedEvents, newEvent]);
  };

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">My Saved Events</h1>
        {savedEvents.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't saved any events yet.</p>
            <a href="/" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 inline-block">
              Explore Events
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedEvents.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
                <h2 className="text-2xl font-bold text-teal-600 mb-3">{event.title}</h2>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Saved on:</strong> {event.addedDate}</p>
                </div>
                <button className="mt-6 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                  Buy Ticket
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <button
            onClick={addMockEvent}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            Save Mock Event (Testing)
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}