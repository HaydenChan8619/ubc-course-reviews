'use client';

import { CourseCard } from "@/components/CourseCard";
import { db } from "@/firebase/clientApp"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection} from "firebase/firestore"; 
import { useState } from "react";
import UIDInitializer from "@/components/UIDInitializer";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [courses, loading, error] = useCollection(
    collection(db, "courses"),
    {}
  );

  const faculties = useMemo(() => {
    if (!courses?.docs) return [];
    const facultiesSet = new Set<string>();
    courses.docs.forEach(doc => {
      const code = doc.data().code;
      const faculty = code.split(' ')[0];
      facultiesSet.add(faculty);
    });
    return Array.from(facultiesSet).sort();
  }, [courses?.docs]);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('All Faculties');
  const [visibleCount, setVisibleCount] = useState(15);

  const filteredCourses = courses?.docs.filter(doc => {
    const data = doc.data();
    const courseYear = parseInt(data.code.charAt(5));
    const courseFaculty = data.code.substring(0, 4);
    const matchesYear = !selectedYear || courseYear === selectedYear;
    const matchesFaculty = selectedFaculty === 'All Faculties' || courseFaculty === selectedFaculty;
    return matchesYear && matchesFaculty;
  });

  const sortedCourses = filteredCourses?.sort(
    (a, b) => b.data().reviewCount - a.data().reviewCount
  );

  const coursesToShow = sortedCourses?.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 15);
  };

  return (
    <div className="relative">
      <UIDInitializer />
      <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md sauder-blue-bk">
      <header className="container mx-auto px-4 py-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">UBC Course Reviews</h1>
        <div className="flex gap-2 overflow-x-auto pb-2 flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger 
              className={`px-4 py-2 rounded-full text-sm font-medium focus:outline-none ${
                selectedYear !== null ? 'hover:bg-green-600 sauder-green-bk text-white' : 'hover:bg-gray-300 bg-white text-black'
              }`}
            >
              {selectedYear ? `Year ${selectedYear}` : "All Years"}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedYear(null)}>
                All Years
              </DropdownMenuItem>
              {[1, 2, 3, 4].map(year => (
                <DropdownMenuItem 
                  key={year} 
                  onClick={() => setSelectedYear(year)}
                >
                  Year {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger 
              className={`px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition-colors ${
                selectedFaculty !== "All Faculties" ? 'hover:bg-green-600 sauder-green-bk text-white' : 'hover:bg-gray-300 bg-white text-black'
              }`}
            >
              {selectedFaculty || "All Faculties"}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedFaculty("All Faculties")}>
                All Faculties
              </DropdownMenuItem>
              {faculties.map(faculty => (
                <DropdownMenuItem 
                  key={faculty} 
                  onClick={() => setSelectedFaculty(faculty)}
                >
                  {faculty}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={() => {
              setSelectedYear(null);
              setSelectedFaculty("All Faculties");
            }}
            className="px-4 py-2 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-700 transition-colors">
            Reset Filters
          </button>
        </div>
      </header>
    </div>
      <main className="container mx-auto px-4 pt-32 pb-8">
        <div className="pt-8 max-md:pt-16"></div>
        <div className="max-md:pt-8"></div>
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

          {sortedCourses && visibleCount < sortedCourses.length && (
            <div className="flex justify-center pt-4">
                  <div className="px-4 py-2 rounded-full text-sm font-medium bg-gray-500 text-white hover:bg-gray-700 transition-colors block mx-auto">
                    <button onClick={handleShowMore}>
                      Show More
                    </button>
                    </div>
                  </div>
                )}
        

        <div className={`fixed inset-0 top-16 backdrop-blur-md flex items-center justify-center transition-opacity ${
          loading ? 'opacity-300' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="animate-spin h-12 w-12 border-4 border-blue-900 rounded-full border-t-transparent"></div>
        </div>
      </main>
    </div>
  );
}