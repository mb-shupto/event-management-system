'use client';

import Image from 'next/image';
import LOGO from '@/app/logo/logo.png';
import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import EventCard from '@/components/EventCard';

type EventListItem = {
  id: string;
  title: string;
  type?: string;
  date?: unknown;
  location?: string;
  description?: string;
  imageUrl?: string;
};

function formatDate(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  // Firestore Timestamp support without importing Timestamp type
  const maybeTimestamp = value as { toDate?: () => Date };
  if (typeof maybeTimestamp.toDate === 'function') {
    return maybeTimestamp.toDate().toISOString().slice(0, 10);
  }
  return '';
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next: EventListItem[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as Omit<EventListItem, 'id'>;
          next.push({ id: d.id, ...data });
        });
        setEvents(next);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching events:', error);
        setEvents([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'all') return events;
    return events.filter((event) => (event.type ?? '') === selectedCategory);
  }, [events, selectedCategory]);

  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-white min-h-screen">
      <div className="mt-4">
        <div className="mb-6 flex items-center">
          <Image src={LOGO} alt="Event Management System Logo" width={50} height={50} className="mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 text-gray-900"
        >
          <option value="all">All Categories</option>
          <option value="seminar">Seminar</option>
          <option value="music show">Music Show</option>
          <option value="hackathon">Hackathon</option>
          <option value="debate">Debate</option>
          <option value="workshop">Workshop</option>
        </select>
      </div>

      {loading ? <p className="text-gray-700">Loading events...</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            type={event.type}
            date={formatDate(event.date)}
            location={event.location}
            description={event.description}
            imageUrl={event.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}