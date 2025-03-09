// @ts-nocheck
'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { FaMagnifyingGlass } from "react-icons/fa6";
import Head from 'next/head';

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Load and parse CSV data on component mount.
  useEffect(() => {
    fetch('/summary.csv')
      .then((response) => response.text())
      .then((csvData) => {
        const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
        setCourses(parsed.data);
      })
      .catch((err) => console.error('Error loading CSV:', err));
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }
  
    // Remove all spaces from the search query and lowercase it.
    const cleanedQuery = searchQuery.replace(/\s/g, '').toLowerCase();
    const isNumericQuery = /^\d/.test(cleanedQuery);
  
    const scored = courses
      .map(course => {
        let score = Infinity;
        // Prepare the course code by removing spaces and lowering case.
        let courseCode = course.code.replace(/\s/g, '').toLowerCase();
  
        if (isNumericQuery) {
          // If the query starts with a number, only compare against the numeric part.
          const parts = course.code.split(' ');
          if (parts.length > 1) {
            courseCode = parts[1].replace(/\s/g, '').toLowerCase();
          }
          if (courseCode.startsWith(cleanedQuery)) {
            score = 1;
          }
        } else {
          // For letter-based queries, check that the field starts with the query.
          if (courseCode.startsWith(cleanedQuery)) {
            score = 1;
          } else if (
            course.name.replace(/\s/g, '').toLowerCase().startsWith(cleanedQuery)
          ) {
            score = 2;
          } else if (
            course.description.replace(/\s/g, '').toLowerCase().startsWith(cleanedQuery)
          ) {
            score = 3;
          }
        }
  
        return { course, score };
      })
      .filter(item => item.score !== Infinity) // Only include courses that match
      .sort((a, b) => a.score - b.score)
      .map(item => item.course);
  
    setSuggestions(scored.slice(0, 5));
  }, [searchQuery, courses]);  
  

  const handleSearch = () => {
    if (searchQuery === '') {
      router.push(`/courses`);
    } else {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
    <Head>
        <meta
          name="description"
          content="UBC Course Reviews - the best place to rant about your courses, and learn more about courses you want to take!"
        />
    </Head>
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white relative overflow-hidden"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute top-0 left-0 w-full h-full"
        />
        <div className="relative text-center h-[50%] md:h-[40%]">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">UBC Course Reviews</h1>
          <p className="text-sm md:text-lg mb-8 italic">Course Reviews by Students, for Students.</p>
          <div className="relative flex justify-center mb-8">
            <Input
              type="text"
              placeholder="Search courses..."
              className="w-50 md:w-80 bg-white text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)} // Delay so clicking a suggestion still works
              onKeyDown={handleKeyDown}
            />
            <Button className="ml-2 font-bold" onClick={handleSearch}>Search</Button>
            {searchQuery.trim() && isInputFocused && suggestions.length > 0 && (
              <div className="md:ml-10 absolute top-full left-0 mt-2 w-[100%] md:w-[83.5%] bg-white text-black rounded shadow-lg z-10 text-left">
                {suggestions.map((course) => (
                  <Link
                    key={course.code}
                    href={`/courses/${course.code.toLowerCase().replace(' ', '-')}`}
                    prefetch={false}
                  >
                    <div className="flex items-center px-3 py-2 hover:bg-gray-200 cursor-pointer rounded">
                      {/* Fixed container for the icon */}
                      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                        <FaMagnifyingGlass className="text-gray-400" />
                      </div>
                      <span className="ml-2 text-sm truncate">
                        {course.code} - {course.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="space-x-4">
            <Link href='/courses' prefetch={false}>
              <Button variant="secondary" className='font-bold'>Explore Courses</Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
    </>
  );
}
