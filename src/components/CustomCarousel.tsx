"use client";

import { useState, useRef } from "react";

const categories = [
  "Seminars", "Concerts", "Workshops", "Sports", "Festivals",
  "Conferences", "Exhibitions", "Fundraisers", "Competitions",
];

type CarouselEvent = {
  id: string | number;
  title: string;
};

type CustomCarouselProps = {
  events?: CarouselEvent[];
};

export default function CustomCarousel({ events = [] }: CustomCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const newPosition = scrollPosition + 200;
      if (newPosition <= 0) {
        setScrollPosition(newPosition);
        carouselRef.current.scrollLeft = -newPosition;
      }
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const maxScroll =
        carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      const newPosition = scrollPosition - 200;
      if (-newPosition <= maxScroll) {
        setScrollPosition(newPosition);
        carouselRef.current.scrollLeft = -newPosition;
      }
    }
  };

  const items =
    events.length > 0
      ? events.map((e) => ({ key: String(e.id), label: e.title }))
      : categories.map((c) => ({ key: c, label: c }));

  return (
    <div className="mb-6 relative">
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        aria-label="Scroll left"
      >
        &lt;
      </button>

      <div
        ref={carouselRef}
        className="flex overflow-x-hidden scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        {items.map((item) => (
          <div
            key={item.key}
            className="min-w-[100px] h-16 flex items-center justify-center bg-blue-100 text-gray-800 mx-2 rounded-md"
          >
            {item.label}
          </div>
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        aria-label="Scroll right"
      >
        &gt;
      </button>
    </div>
  );
}