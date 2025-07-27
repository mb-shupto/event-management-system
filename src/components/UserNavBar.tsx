"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { HomeIcon, CalendarIcon, PlusCircleIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const userOptions = [
  { label: "Dashboard", href: "/user/dashboard", icon: HomeIcon },
  { label: "My Events", href: "/user/events", icon: CalendarIcon },
  { label: "Create Event", href: "/events/create", icon: PlusCircleIcon },
  { label: "My Profile", href: "/user/profile", icon: UserIcon },
  { label: "Logout", action: "logout", icon: ArrowRightOnRectangleIcon },
];

export default function UserNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Placeholder for logout logic (e.g., API call to invalidate session)
    router.push("/user/login");
  };

  return (
    <nav className="bg-blue-400 w-full  text-white text-sm font-medium py-3 shadow-md">
      <div className="flex items-center space-x-4">
        {userOptions.map((option) => {
          const isActive = option.href === pathname;
          return (
            <div key={option.label} className="flex items-center">
              {option.href ? (
                <Link
                  href={option.href}
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    isActive ? 'text-white' : 'hover:bg-[#314256]'
                  }`}
                >
                  <option.icon className={`w-5 h-5 mr-2 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                  {option.label}
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 hover:bg-[#314256] rounded-md transition"
                >
                  <option.icon className="w-5 h-5 mr-2 text-gray-300" />
                  {option.label}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}