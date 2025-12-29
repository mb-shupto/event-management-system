'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type EventRecord = {
	id: string;
	title?: string;
	date?: string;
	location?: string;
	description?: string;
	imageUrl?: string;
	type?: string;
	createdAt?: unknown;
};

function safeDateFromEventDate(dateValue: unknown): Date | null {
	if (!dateValue) return null;
	if (dateValue instanceof Date) return dateValue;
	if (typeof dateValue === 'string' || typeof dateValue === 'number') {
		const d = new Date(dateValue);
		return Number.isNaN(d.getTime()) ? null : d;
	}
	return null;
}

function yyyyMmDd(d: Date): string {
	return d.toISOString().slice(0, 10);
}

export default function RecentEventsPage() {
	// This route lives under /events/[id]/recent; we don’t need the id for the query,
	// but it can be used to exclude the current event from the “recent” list.
	const params = useParams();
	const currentEventId = typeof params?.id === 'string' ? params.id : null;

	const [loading, setLoading] = useState(true);
	const [events, setEvents] = useState<EventRecord[]>([]);

	useEffect(() => {
		const q = query(collection(db, 'events'), orderBy('date', 'desc'), limit(25));
		const unsub = onSnapshot(
			q,
			(snapshot) => {
				const list: EventRecord[] = snapshot.docs.map((doc) => ({
					id: doc.id,
					...(doc.data() as Omit<EventRecord, 'id'>),
				}));
				setEvents(list);
				setLoading(false);
			},
			(error) => {
				console.error('Error fetching recent events:', error);
				setEvents([]);
				setLoading(false);
			},
		);

		return () => unsub();
	}, []);

	const { visibleEvents, totalRecentCount } = useMemo(() => {
		const today = new Date();
		const todayStr = yyyyMmDd(today);
		const threshold = new Date(today);
		threshold.setDate(threshold.getDate() - 30);
		const thresholdStr = yyyyMmDd(threshold);

		const recent = events
			.filter((e) => (currentEventId ? e.id !== currentEventId : true))
			.filter((e) => {
				// Most events use YYYY-MM-DD strings. We can compare safely as strings.
				if (typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(e.date)) {
					return e.date < todayStr && e.date >= thresholdStr;
				}

				// Fallback: parse & compare.
				const d = safeDateFromEventDate(e.date);
				return d ? d < today && d >= threshold : false;
			});

		return { visibleEvents: recent.slice(0, 6), totalRecentCount: recent.length };
	}, [events, currentEventId]);

	return (
		<div className="p-6">
			<div className="max-w-6xl mx-auto">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900">Recent Events</h1>
					<p className="text-gray-600 mt-1">
						A quick look at recently passed events (archived). Want the full archive? Create an account.
					</p>
				</div>

				{loading ? (
					<div className="bg-white rounded-xl shadow p-6 text-gray-900">Loading recent events...</div>
				) : visibleEvents.length === 0 ? (
					<div className="bg-white rounded-xl shadow p-10 text-center text-gray-900">
						<h2 className="text-2xl font-bold">No recent events</h2>
						<p className="text-gray-600 mt-2">Check back soon — new events are posted regularly.</p>
						<div className="mt-6">
							<Link
								href="/welcome"
								className="inline-flex items-center rounded-md bg-blue-400 px-5 py-3 text-white font-semibold hover:bg-blue-700"
							>
								See more
							</Link>
						</div>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{visibleEvents.map((event) => {
								const eventDate = safeDateFromEventDate(event.date);
								return (
									<div key={event.id} className="bg-white rounded-xl shadow overflow-hidden">
										<div className="relative w-full h-40 bg-gray-100">
											<Image
												src={event.imageUrl || 'https://via.placeholder.com/900x450?text=Archived+Event'}
												alt={event.title || 'Archived Event'}
												fill
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												className="object-cover"
											/>
											<div className="absolute top-3 left-3 rounded-full bg-blue-400 text-white text-xs font-bold px-3 py-1">
												ARCHIVED
											</div>
										</div>

										<div className="p-5 text-gray-900">
											<h3 className="text-xl font-bold text-blue-400 truncate">
												{event.title || 'Untitled Event'}
											</h3>
											<p className="text-sm text-gray-600 mt-1">
												{eventDate ? eventDate.toLocaleDateString() : event.date || '—'}
												{event.location ? ` • ${event.location}` : ''}
											</p>
											{event.type ? <p className="text-sm text-gray-600 mt-1">{event.type}</p> : null}
											{event.description ? (
												<p className="text-gray-700 mt-3 line-clamp-3">{event.description}</p>
											) : (
												<p className="text-gray-500 mt-3 italic">No archived description available.</p>
											)}
										</div>
									</div>
								);
							})}
						</div>

						<div className="mt-8 bg-white rounded-xl shadow p-6 text-gray-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div>
								<p className="font-semibold">Showing {Math.min(6, totalRecentCount)} of {totalRecentCount} recent archived events</p>
								<p className="text-gray-600 text-sm mt-1">Sign up or log in to view the full archive and details.</p>
							</div>
							<Link
								href="/welcome"
								className="inline-flex items-center justify-center rounded-md bg-blue-400 px-6 py-3 text-white font-semibold hover:bg-blue-700"
							>
								See more
							</Link>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
