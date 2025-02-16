import { CourseCard } from "@/components/CourseCard";

// Temporary mock data - will be replaced with actual data later
const mockCourses = [
  {
    code: "COMM 101",
    name: "Introduction to Business Communication",
    rating: 4.5,
    description: "Learn the fundamentals of business communication including written, verbal, and digital communication strategies."
  },
  {
    code: "ECON 201",
    name: "Microeconomics",
    rating: 4.2,
    description: "Study of how individuals and businesses make decisions in a world of scarcity."
  },
  {
    code: "PSYC 100",
    name: "Introduction to Psychology",
    rating: 4.8,
    description: "Explore the fundamental principles of human behavior and mental processes."
  }
];

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Sauder Course Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map((course) => (
          <CourseCard key={course.code} course={course} />
        ))}
      </div>
    </main>
  );
}