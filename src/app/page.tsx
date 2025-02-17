'use client';

import { CourseCard } from "@/components/CourseCard";
import { db } from "@/firebase/clientApp"
import { useCollection } from "react-firebase-hooks/firestore"
import { collection, Firestore } from "firebase/firestore"; 

export default function Home() {
  const [courses,loading,error] = useCollection(
    collection(db, "courses"),
    {}
  ); 

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Sauder Course Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.docs.map((doc) => {
          const courseData = doc.data();
          return (
            <CourseCard 
              key={doc.id}  // Better to use Firestore's document ID as key
              course={courseData}
            />
          );
        })}
      </div>
    </main>
  );
}