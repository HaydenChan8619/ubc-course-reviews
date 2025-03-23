//@ts-nocheck
'use client';

import { CourseCard } from "@/components/CourseCard";
import { db } from "@/firebase/clientApp";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { useState, useMemo, useEffect, useRef } from "react";
import UIDInitializer from "@/components/UIDInitializer";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { MobileFilterDialog } from "@/components/MobileFilterDialog";

export default function CoursesPage({coursesData}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');

  //const [summaryDoc, loading, error] = useDocument(doc(db, "summary", "summary"));
  //const summaryMap = summaryDoc?.data()?.summary || {};
  const summaryMap = coursesData;

  const courses = useMemo(() => {
    return Object.entries(summaryMap).map(([id, data]) => ({
      id,
      data: () => data,
    }));
  }, [summaryMap]);

  const faculties = useMemo(() => {
    const facultiesSet = new Set();
    courses.forEach(course => {
      const code = course.data().code;
      const faculty = code.split(' ')[0];
      if (faculty) {
        facultiesSet.add(faculty);
      }
    });
    return Array.from(facultiesSet).sort();
  }, [courses]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState('All Faculties');
  const [visibleCount, setVisibleCount] = useState(15);
  const [newSearchQuery, setNewSearchQuery] = useState(searchQuery == null ? '' : searchQuery);

  // New state for sorting method: "reviews" (default) or "rating"
  const [sortMethod, setSortMethod] = useState('reviews');

  // Create a ref for the search input
  const searchInputRef = useRef(null);

  const filteredCourses = courses.filter(course => {
    const data = course.data();

    const courseYear = parseInt(data.code.split(' ')[1].charAt(0));
    const courseFaculty = data.code.split(' ')[0];
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

  /*const sortedCourses = filteredCourses?.sort((a, b) => {
    const aData = a.data();
    const bData = b.data();

    // If there's no search query, sort by the selected method and then alphabetically.
    if (!searchQuery) {
      if (sortMethod === 'reviews') {
        const reviewDiff = bData.reviewCount - aData.reviewCount;
        if (reviewDiff !== 0) return reviewDiff;
      } else if (sortMethod === 'rating') {
        // Assumes each course has a 'rating' field (e.g., average rating)
        const ratingDiff = bData.averageRating - aData.averageRating;
        if (ratingDiff !== 0) return ratingDiff;
      }
      return aData.code.localeCompare(bData.code);
    }

    // When there is a search query, first determine match priority
    const query = searchQuery.toLowerCase();
    const getMatchPriority = (course) => {
      const { code, name } = course;
      if (code.toLowerCase().startsWith(query)) return 2;
      if (name.toLowerCase().startsWith(query)) return 1;
      return 0;
    };

    const priorityA = getMatchPriority(aData);
    const priorityB = getMatchPriority(bData);

    if (priorityA !== priorityB) {
      return priorityB - priorityA;
    }

    // Then sort based on the selected method
    if (sortMethod === 'reviews') {
      const reviewDiff = bData.reviewCount - aData.reviewCount;
      if (reviewDiff !== 0) return reviewDiff;
    } else if (sortMethod === 'rating') {
      const ratingDiff = bData.rating - aData.rating;
      if (ratingDiff !== 0) return ratingDiff;
    }

    return aData.code.localeCompare(bData.code);
  }); */ 

  // Helper function to calculate match level
const getMatchLevel = (courseData, query) => {
  const normQuery = query.replace(/\s+/g, '').toLowerCase();
  const normCode = courseData.code.replace(/\s+/g, '').toLowerCase();
  const normName = courseData.name.replace(/\s+/g, '').toLowerCase();
  const normDesc = courseData.description.replace(/\s+/g, '').toLowerCase();

  // If query starts with a digit, compare against the numeric part of the course code
  if (/^\d/.test(normQuery)) {
    const parts = courseData.code.split(' ');
    if (parts.length > 1) {
      const numericPart = parts.slice(1).join('').toLowerCase();
      if (numericPart.startsWith(normQuery)) {
        return 3; // Best match: numeric part of code
      }
    }
  } else {
    // For letter queries, check if the full code (without spaces) starts with the query
    if (normCode.startsWith(normQuery)) {
      return 3; // Best match: code match
    }
  }
  // Next priority: course name
  if (normName.startsWith(normQuery)) {
    return 2;
  }
  // Next: course description
  if (normDesc.startsWith(normQuery)) {
    return 1;
  }
  // No match found
  return 0;
};

const sortedCourses = filteredCourses?.sort((a, b) => {
  const aData = a.data();
  const bData = b.data();

  if (searchQuery) {
    const aLevel = getMatchLevel(aData, searchQuery);
    const bLevel = getMatchLevel(bData, searchQuery);
    // Higher match level comes first.
    if (aLevel !== bLevel) {
      return bLevel - aLevel;
    }
    // If both courses have the same match level, then sort by the selected sort method.
    if (sortMethod === 'reviews') {
      const reviewDiff = bData.reviewCount - aData.reviewCount;
      if (reviewDiff !== 0) return reviewDiff;
    } else if (sortMethod === 'rating') {
      const ratingDiff = bData.averageRating - aData.averageRating;
      if (ratingDiff !== 0) return ratingDiff;
    }
    // Fallback: alphabetical order by course code.
    return aData.code.localeCompare(bData.code);
  } else {
    // When there's no search query, sort by the selected method first and then alphabetically.
    if (sortMethod === 'reviews') {
      const reviewDiff = bData.reviewCount - aData.reviewCount;
      if (reviewDiff !== 0) return reviewDiff;
    } else if (sortMethod === 'rating') {
      const ratingDiff = bData.averageRating - aData.averageRating;
      if (ratingDiff !== 0) return ratingDiff;
    }
    return aData.code.localeCompare(bData.code);
  }
});

  

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
    setSortMethod('reviews');
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
          {/* Desktop Inline Filter Controls */}
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
                <DropdownMenuItem onClick={() => setSelectedYear(5)}>
                  Year 5
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

            {/* New Sorting Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-gray-500 text-white px-4 py-2 rounded outline-black text-sm flex items-center">
                {sortMethod === 'reviews'
                  ? 'Sort by Number of Reviews'
                  : 'Sort by Average Rating'}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-600 text-white">
                <DropdownMenuItem onClick={() => setSortMethod('reviews')}>
                  Number of Reviews
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortMethod('rating')}>
                  Average Rating
                </DropdownMenuItem>
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
            sortMethod={sortMethod}
            setSortMethod={setSortMethod}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesToShow?.map((doc) => {
            const courseData = doc.data();
            console.log(courseData);
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

        {/* Loading Indicator 
        <div className={`fixed inset-0 top-16 backdrop-blur-md flex items-center justify-center transition-opacity ${
          loading ? 'opacity-300' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="animate-spin h-12 w-12 border-4 border-blue-900 rounded-full border-t-transparent"></div>
        </div>*/}
      </main>
    </div>
  );
}
