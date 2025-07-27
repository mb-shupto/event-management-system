"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    console.log("Contact Form Submitted:", formData);
    setTimeout(() => setSuccess(false), 3000); // Reset success message after 3 seconds
  };

  return (
    <div className="p-4 bg-gradient-to-r from-blue-100 to-white min-h-screen">
      <div className="mt-4">
        <div className="mb-6 flex items-center">
          <Image
            src={LOGO}
            alt="Event Management System Logo"
            width={50}
            height={50}
            className="mr-2"
          />
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <div className="space-y-4 text-black">
            <div className="flex items-center">
              <MapPinIcon className="w-6 h-6 text-blue-600 mr-2" />
              <p>123 Campus Road, Dhaka, Bangladesh</p>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="w-6 h-6 text-blue-600 mr-2" />
              <p>+880 1234 567890</p>
            </div>
            <div className="flex items-center">
              <EnvelopeIcon className="w-6 h-6 text-blue-600 mr-2" />
              <p>support@eventsystem.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
                placeholder="Enter your message"
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500"
            >
              Send Message
            </button>
            {success && (
              <div className="text-green-600 text-center">Message sent successfully!</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}