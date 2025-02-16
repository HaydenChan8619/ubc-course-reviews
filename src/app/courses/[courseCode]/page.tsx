import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { ReviewForm } from "@/components/ReviewForm";
import { ClientReviewDialog } from "@/components/ClientReviewDialog";
import { Review } from "@/types/course";

// Temporary mock data - will be replaced with actual data fetching
const mockCourses = {
  'comm-101': {
    code: "COMM 101",
    name: "Introduction to Business Communication",
    rating: 4.5,
    description: "Learn the fundamentals of business communication including written, verbal, and digital communication strategies."
  },
  'econ-201': {
    code: "ECON 201",
    name: "Microeconomics",
    rating: 4.2,
    description: "Study of how individuals and businesses make decisions in a world of scarcity."
  },
  'psyc-100': {
    code: "PSYC 100",
    name: "Introduction to Psychology",
    rating: 4.8,
    description: "Explore the fundamental principles of human behavior and mental processes."
  }
};

const mockReviews: Review[] = [
  {
    id: "1",
    courseCode: "comm-101",
    ratings: {
      usefulness: 5,
      easiness: 4,
      enjoyment: 5
    },
    overallRating: 4.5,
    comment: "Great introductory course! The professor was very engaging.",
    authorName: "John Doe",
    createdAt: new Date("2024-03-15")
  },
  {
    id: "2",
    courseCode: "comm-101",
    ratings: {
      usefulness: 4,
      easiness: 3,
      enjoyment: 5
    },
    overallRating: 4,
    comment: "Good content but heavy workload.",
    authorName: "Jane Smith",
    createdAt: new Date("2024-03-10")
  }
];

export function generateStaticParams() {
  return Object.keys(mockCourses).map((courseCode) => ({
    courseCode,
  }));
}

export default function CoursePage({ params }: { params: { courseCode: string } }) {
  const course = mockCourses[params.courseCode];

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{course.code}</h1>
          <h2 className="text-2xl text-muted-foreground mb-4">{course.name}</h2>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-medium">{course.rating.toFixed(1)}</span>
          </div>
          <p className="text-lg">{course.description}</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Reviews</h3>
            <ClientReviewDialog courseCode={course.code} />
          </div>

          <div className="space-y-4">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{review.overallRating.toFixed(1)}</span>
                    <span className="text-sm italic text-muted-foreground">{review.authorName}</span>
                    <span className="text-sm italic text-muted-foreground">{review.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Usefulness:</span>
                      <div className="font-medium">{review.ratings.usefulness}/5</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Easiness:</span>
                      <div className="font-medium">{review.ratings.easiness}/5</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Enjoyment:</span>
                      <div className="font-medium">{review.ratings.enjoyment}/5</div>
                    </div>
                  </div>
                  <p className="mb-4">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}