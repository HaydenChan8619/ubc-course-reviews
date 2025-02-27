import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 sauder-blue-bk text-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer">UBC Course Reviews</span>
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <Link href="/about">
            <span className="hover:underline font-bold cursor-pointer">About</span>
          </Link>
        </div>
        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/courses">
              <span className="block px-3 py-2 rounded-md text-base font-medium hover:underline cursor-pointer">
                Courses
              </span>
            </Link>
            <Link href="/about">
              <span className="block px-3 py-2 rounded-md text-base font-medium hover:underline cursor-pointer">
                About
              </span>
            </Link>
            <Link href="/contact">
              <span className="block px-3 py-2 rounded-md text-base font-medium hover:underline cursor-pointer">
                Contact
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
