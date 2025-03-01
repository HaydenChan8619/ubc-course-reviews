//@ts-nocheck
'use client';

import { CourseCard } from "@/components/CourseCard";
import { db } from "@/firebase/clientApp";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { useState, useMemo, useEffect, useRef } from "react";
import UIDInitializer from "@/components/UIDInitializer";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { MobileFilterDialog } from "@/components/MobileFilterDialog";

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');

  const [courses, loading, error] = useCollection(
    collection(db, "courses"),
    {}
  );

  const faculties = useMemo(() => {
    if (!courses?.docs) return [];
    const facultiesSet = new Set();
    courses.docs.forEach(doc => {
      const code = doc.data().code;
      const faculty = code.split(' ')[0];
      facultiesSet.add(faculty);
    });
    return Array.from(facultiesSet).sort();
  }, [courses?.docs]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState('All Faculties');
  const [visibleCount, setVisibleCount] = useState(15);
  const [newSearchQuery, setNewSearchQuery] = useState(searchQuery == null ? '' : searchQuery);

  // Create a ref for the search input
  const searchInputRef = useRef(null);

  const filteredCourses = courses?.docs.filter(doc => {
    const data = doc.data();
    const courseYear = parseInt(data.code.charAt(5));
    const courseFaculty = data.code.substring(0, 4);
    const matchesYear = !selectedYear || courseYear === selectedYear;
    const matchesFaculty = selectedFaculty === 'All Faculties' || courseFaculty === selectedFaculty;

    let searchMatches = true;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      searchMatches =
        data.code.toLowerCase().includes(lowerQuery) ||
        data.name.toLowerCase().includes(lowerQuery) ||
        data.description.toLowerCase().includes(lowerQuery);
    }

    return matchesYear && matchesFaculty && searchMatches;
  });

  const sortedCourses = filteredCourses?.sort(
    (a, b) => b.data().reviewCount - a.data().reviewCount
  );

  const coursesToShow = sortedCourses?.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 15);
  };

  const handleSearch = () => {
    if (newSearchQuery === '') {
      router.push(`/courses`);
    } else {
      router.push(`/courses?search=${encodeURIComponent(newSearchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSelectedYear(null);
    setSelectedFaculty('All Faculties');
    setNewSearchQuery('');
    router.push('/courses');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 1);

    return () => clearTimeout(timer);
  }, [newSearchQuery]);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // New function to focus on the search bar
  const focusTop = () => {
    if (searchInputRef.current) {
      // Smoothly scroll the search input into view
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Optionally delay the focus to allow the scroll animation to finish
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 1000); // adjust the delay as needed
    }
  };

  return (
    <div className="relative">
      <UIDInitializer />
      <div ref={searchInputRef} />
      <Navbar />
      <main className="container mx-auto px-4 pt-4 pb-4">
        {/* Combined Search Input & Filter Button Row */}
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search courses..."
              className="w-full bg-white text-black outline-black"
              value={newSearchQuery}
              onChange={(e) => setNewSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {/* Desktop Inline Filter Controls (unchanged) */}
          <div className="hidden md:flex items-center ml-8 space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-gray-500 text-white px-4 py-2 rounded outline-black text-sm flex items-center">
                {selectedYear ? `Year ${selectedYear}` : "All Years"}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-600 text-white">
                <DropdownMenuItem onClick={() => setSelectedYear(null)}>
                  All Years
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedYear(1)}>
                  Year 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedYear(2)}>
                  Year 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedYear(3)}>
                  Year 3
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedYear(4)}>
                  Year 4
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="bg-gray-500 text-white px-4 py-2 rounded outline-black text-sm flex items-center">
                {selectedFaculty}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-600 text-white max-h-[215px] overflow-y-auto">
                <DropdownMenuItem onClick={() => setSelectedFaculty("All Faculties")}>
                  All Faculties
                </DropdownMenuItem>
                {faculties.map((fac) => (
                  <DropdownMenuItem key={fac} onClick={() => setSelectedFaculty(fac)}>
                    {fac}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="destructive" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
          <MobileFilterDialog
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedFaculty={selectedFaculty}
            setSelectedFaculty={setSelectedFaculty}
            faculties={faculties}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesToShow?.map((doc) => {
            const courseData = doc.data();
            return (
              <CourseCard
                key={doc.id}
                course={courseData}
              />
            );
          })}
        </div>

        <div className="fixed bottom-8 right-8 z-50">
          {(
            <Button onClick={focusTop}><ChevronUpIcon/></Button>
          )}
        </div>

        {/* Show More Button */}
        {sortedCourses && visibleCount < sortedCourses.length && (
          <div className="flex justify-center pt-4">
            <div className="px-4 py-2 mx-auto">
              <Button onClick={handleShowMore}>Show More</Button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        <div className={`fixed inset-0 top-16 backdrop-blur-md flex items-center justify-center transition-opacity ${
          loading ? 'opacity-300' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="animate-spin h-12 w-12 border-4 border-blue-900 rounded-full border-t-transparent"></div>
        </div>
      </main>
    </div>
  );
}