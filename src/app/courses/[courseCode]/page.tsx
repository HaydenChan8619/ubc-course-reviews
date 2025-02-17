import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { ReviewForm } from "@/components/ReviewForm";
import { ClientReviewDialog } from "@/components/ClientReviewDialog";
import { Review } from "@/types/course";

import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { DocumentData } from "firebase/firestore";
import { db } from "@/firebase/clientApp"
import { doc, getDoc } from "firebase/firestore";

export function getRating(doc: DocumentData): number {
  const reviews = doc.reviews;

  if (!reviews || typeof reviews !== 'object') return 0;

  const reviewValues = Object.values(reviews);

  const ratings = reviewValues
    .map((review: any) => review.overallRating)
    .filter((rating: number) => typeof rating === 'number');

  if (ratings.length === 0) return 0;

  const total = ratings.reduce((acc, rating) => acc + rating, 0);

  return total / ratings.length;
}

export default async function CoursePage({
  params,
}: {
  params: { courseCode: string };
}) {
  const courseDocRef = doc(db, "courses", params.courseCode);
  const courseDocSnap = await getDoc(courseDocRef);
  const course = courseDocSnap.data();

  if (course == null) return <div>Pick Another Course!</div>

  const reviews = course.reviews;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{course.code}</h1>
          <h2 className="text-2xl text-muted-foreground mb-4">{course.name}</h2>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-medium">
              {getRating(course)}
            </span>
          </div>
          <p className="text-lg">{course.description}</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Reviews</h3>
            <ClientReviewDialog courseCode={params.courseCode} />
          </div>

          <div className="space-y-4">
            {Object.values(reviews).map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {review.overallRating}
                    </span>
                    <span className="text-sm italic text-muted-foreground">
                      {review.name}
                    </span>
                    <span className="text-sm italic text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Usefulness:</span>
                      <div className="font-medium">
                        {review.usefulness}/5
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Easiness:</span>
                      <div className="font-medium">
                        {review.easiness}/5
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Enjoyment:</span>
                      <div className="font-medium">
                        {review.enjoyment}/5
                      </div>
                    </div>
                  </div>
                  <p className="mb-4">{review.comments}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}