"use client";

import Image from "next/image";
import LOGO from "@/app/logo/logo.png";
import { UsersIcon } from "@heroicons/react/24/outline";

const teamMembers = [
  { name: "Alice Smith", role: "Founder", image: "/placeholder1.jpg" },
  { name: "Bob Johnson", role: "Event Coordinator", image: "/placeholder2.jpg" },
  { name: "Clara Lee", role: "Marketing Lead", image: "/placeholder3.jpg" },
];

export default function AboutPage() {
  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-white min-h-screen">
      <div className="mt-4">
        <div className="mb-6 flex items-center">
          <Image
            src={LOGO}
            alt="Event Management System Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
        </div>
      </div>

      <div className="space-y-8">
        {/* Mission Statement */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h2>
          <p className="text-gray-600">
            At Event Management System, we are passionate about bringing people together through
            unforgettable campus events. Our mission is to simplify event planning, enhance
            engagement, and create memorable experiences for students, faculty, and the community.
          </p>
        </div>

        {/* History */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Our History</h2>
          <p className="text-gray-600">
            Founded in 2023, we started as a small team with a vision to revolutionize campus event
            management. Over the past two years, we’ve grown to support hundreds of events, from
            seminars to concerts, and continue to innovate with cutting-edge technology.
          </p>
        </div>

        {/* Team */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <UsersIcon className="w-6 h-6 text-green-600 mr-2" />
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <Image
                  src={member.image}
                  alt={`${member.name} profile`}
                  width={100}
                  height={100}
                  className="rounded-full mx-auto mb-2"
                />
                <h3 className="text-lg font-medium text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}