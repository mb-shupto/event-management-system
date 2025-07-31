"use client";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function SubFooter() {
  return (
    <footer className="bg-blue-400 text-white p-6 border-t border-gray-200 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
    

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              <a href="mailto:support@eventmgmt.com" className="hover:text-blue-600">
                support@eventmgmt.com
              </a>
            </li>
            <li className="flex items-center">
              <PhoneIcon className="w-5 h-5 mr-2" />
              <span>+880 123 456 7890</span>
            </li>
            <li className="flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2" />
              <span>123 Campus Rd, Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-blue-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988h-2.54v-2.891h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-blue-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 4.01c-.81.36-1.68.6-2.59.71a4.52 4.52 0 001.98-2.49 9.05 9.05 0 01-2.87 1.1 4.51 4.51 0 00-7.68 4.12 12.79 12.79 0 01-9.29-4.7 4.51 4.51 0 001.4 6.02 4.48 4.48 0 01-2.04-.56v.06a4.51 4.51 0 003.62 4.42 4.49 4.49 0 01-2.03.08 4.51 4.51 0 004.21 3.13 9.04 9.04 0 01-5.59 1.93c-.36 0-.71-.02-1.06-.06a12.78 12.78 0 006.92 2.03c8.31 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.59A9.17 9.17 0 0022 4.01z" />
              </svg>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-blue-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h-.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}