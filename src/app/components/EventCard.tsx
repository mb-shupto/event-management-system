'use client';

import Link from 'next/link';

interface EventCardProps {
  id: number;
  title: string;
  type: string;
  date: string;
  description: string;
}

const EventCard: React.FC<EventCardProps> = ({ id, title, type, date, description }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">Type: {type}</p>
      <p className="text-gray-600">Date: {date}</p>
      <p className="text-gray-600 mt-2">{description}</p>
      <Link href={`/user/events/${id}`} className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        View Details
      </Link>
    </div>
  );
};

export default EventCard;