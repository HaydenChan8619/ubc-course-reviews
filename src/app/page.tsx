// @ts-nocheck
'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Navigate to /courses and pass the search query as a query parameter.
    if (searchQuery == '') {
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
          <div className="flex justify-center mb-8">
            <Input
              type="text"
              placeholder="Search courses..."
              className="w-50 md:w-80 bg-white text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button className="ml-2 font-bold" onClick={handleSearch}>Search</Button>
          </div>
          <div className="space-x-4" >
            <Link href='/courses'>
              <Button variant="secondary" className='font-bold'>Explore Courses</Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
