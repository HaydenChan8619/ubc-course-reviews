'use client';

import { CourseCard } from "@/components/CourseCard";
import { db } from "@/firebase/clientApp"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection} from "firebase/firestore"; 
import { useState } from "react";
import Footer from "@/components/Footer";

export default function Home() {
  const [courses, loading, error] = useCollection(
    collection(db, "courses"),
    {}
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const filteredCourses = courses?.docs.filter(doc => {
    if (!selectedYear) return true;
    const courseYear = doc.data().code.charAt(5);
    return parseInt(courseYear) === selectedYear;
  });

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md sauder-blue-bk">
        <header className="container mx-auto px-4 py-4">
          <h1 className="text-4xl font-bold text-white mb-4">Sauder Course Reviews</h1>
          <div className="flex gap-2 overflow-x-auto pb-2 sauder">
            <button
              onClick={() => setSelectedYear(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                !selectedYear ? 'sauder-green-bk text-white' : 'sauder-blue-bk text-white'
              }`}
            >
              All Courses
            </button>
            {[1, 2, 3, 4].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedYear === year ? 'sauder-green-bk text-white' : 'sauder-blue-bk text-white'
                }`}
              >
                Year {year}
              </button>
            ))}
          </div>
        </header>
      </div>

      <main className="container mx-auto px-4 pt-32 pb-8">
        <div className="pt-8 max-md:pt-16"></div>
        <div className="max-md:pt-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses?.map((doc) => {
            const courseData = doc.data();
            return (
              <CourseCard 
                key={doc.id}
                course={courseData}
              />
            );
          })}
        </div>

        

        <div className={`fixed inset-0 top-16 backdrop-blur-md flex items-center justify-center transition-opacity ${
          loading ? 'opacity-300' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="animate-spin h-12 w-12 border-4 border-blue-900 rounded-full border-t-transparent"></div>
        </div>
      </main>
    </div>
  );
}