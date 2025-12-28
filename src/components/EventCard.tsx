"use client";

import Image from "next/image";
import Link from "next/link";

type EventCardProps = {
  id: string;
  title: string;
  date?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  type?: string;
};

export default function EventCard({
  id,
  title,
  date,
  location,
  description,
  imageUrl,
  type,
}: EventCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
      <div className="relative w-full h-44 bg-gray-100">
        <Image
          src={imageUrl || "https://via.placeholder.com/800x400?text=Event+Image"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-blue-400">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {date ? date : ""}{date && location ? " • " : ""}{location ? location : ""}
        </p>
        {type ? <p className="text-sm text-gray-600 mt-1">{type}</p> : null}
        {description ? (
          <p className="text-gray-700 mt-3 line-clamp-3">{description}</p>
        ) : null}

        <div className="mt-4">
          <Link
            href={`/user/events/${id}`}
            className="inline-block bg-blue-400 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}