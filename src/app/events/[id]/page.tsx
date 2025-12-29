'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';


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

export default function EventDetail() {
    const params = useParams();
    const { id } = params;
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchEvent = async () => {
            try {
                const eventDoc = await getDoc(doc(db, 'events', id as string));
                if (eventDoc.exists()) {
                    setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event:', error);
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white text-2xl">Loading event details...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white text-2xl">Event not found</p>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="max-w-5xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <Image
                        src={event.imageUrl || 'https://via.placeholder.com/1200x600?text=Event+Image'}
                        alt={event.title}
                        width={1200}
                        height={600}
                        className="w-full object-cover"
                    />
                    <div className="p-8 md:p-12">
                        <h1 className="text-5xl font-bold text-blue-700 mb-6">{event.title}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-gray-700">
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="w-8 h-8 text-blue-600" />
                                <MapPinIcon className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="font-semibold">Date</p>
                                    <p className="text-xl">{new Date(event.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <p className="font-semibold">Location</p>
                                    <p className="text-xl">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">About this Event</h2>
                            <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8">Choose Your Ticket</h2>
                            {event.ticketTiers && event.ticketTiers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {event.ticketTiers.map((tier) => {
                                        const remaining = tier.total - tier.sold;
                                        const isSoldOut = remaining === 0;
                                        const isSelected = selectedTier?.name === tier.name;

                                        return (
                                            <div
                                                key={tier.name}
                                                onClick={() => !isSoldOut && setSelectedTier(tier)}
                                                className={`p-8 rounded-2xl border-4 transition-all cursor-pointer ${isSelected
                                                        ? 'border-blue-500 bg-blue-50 shadow-2xl scale-105'
                                                        : isSoldOut
                                                            ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                                                            : 'border-gray-300 hover:border-blue-400 hover:shadow-xl'
                                                    }`}
                                            >
                                                <h3 className="text-2xl font-bold text-center mb-4">{tier.name}</h3>
                                                <p className="text-5xl font-bold text-center text-blue-400 mb-6">${tier.price}</p>
                                                <div className="text-center">
                                                    <p className={`text-lg font-semibold ${isSoldOut ? 'text-red-600' : 'text-gray-700'}`}>
                                                        {isSoldOut ? 'Sold Out' : `${remaining} tickets left`}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-2">of {tier.total} total</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 text-xl">No ticket tiers available for this event.</p>
                                </div>
                            )}

                            {selectedTier && (
                                <div className="mt-12 text-center">
                                    <div className="bg-blue-100 p-6 rounded-xl inline-block mb-6">
                                        <p className="text-2xl font-bold">
                                            You selected: <span className="text-blue-700">{selectedTier.name}</span>
                                        </p>
                                        <p className="text-3xl font-bold text-blue-400 mt-2">${selectedTier.price}</p>
                                    </div>
                                    <button className="bg-blue-400 text-white px-12 py-5 rounded-full text-2xl font-bold hover:bg-blue-700 transition shadow-lg">
                                        Complete Purchase
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}