// @ts-nocheck
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { ClientReviewDialog } from "@/components/ClientReviewDialog";

import { DocumentData } from "firebase/firestore";
import { db } from "@/firebase/clientApp"
import { doc, getDoc } from "firebase/firestore";
import { toZonedTime, format } from 'date-fns-tz';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import { AccordionHeader } from "@radix-ui/react-accordion";

function getRating(doc: DocumentData): number {
  let count = 0;
  let total = 0;

  if (doc.reviews == null) return 0;
  
  Object.values(doc.reviews).forEach((review: any) => {
    total += review.overallRating;
    count++;
  });

  return Math.round((total / count) * 100) / 100;
}

function getDate(doc: DocumentData): string {
  const timestamp = doc.date;
  const date = timestamp.toDate();

  const timeZone = 'America/Vancouver';
  const zonedDate = toZonedTime(date, timeZone);
  
  return format(zonedDate, 'yyyy-MM-dd', { timeZone });
}

export default async function CoursePage({ params }: { params: any }) {
  const { courseCode } = params as { courseCode: string };
  const courseDocRef = doc(db, "courses", courseCode);
  const courseDocSnap = await getDoc(courseDocRef);
  const course = courseDocSnap.data();

  if (course == null) return <div>Pick Another Course!</div>

  const reviews = course.reviews;

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md sauder-blue-bk">
        <header className="container mx-auto px-4 py-4">
          <h1 className="text-4xl font-bold text-white mb-4">Sauder Course Reviews</h1>
          <div className="flex gap-2 overflow-x-auto pb-2">
          <Link href="/" className="px-4 py-2 rounded-full text-sm font-medium sauder-green-bk text-white">
            Back to Home Page
          </Link>
          </div>
        </header>
      </div>
      <div className="pt-8 max-md:pt-16"></div>
      <main className="container mx-auto px-4 py-8 pt-32">
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
            <Accordion type="single" collapsible className="w-full border border-gray-300 rounded-lg">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-bold pl-4">Course Description</AccordionTrigger>
                <AccordionContent className="pl-4 pr-4">
                {course.description}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Reviews</h3>
              <ClientReviewDialog courseCode={courseCode} />
            </div>

            <div className="space-y-4">
              {reviews && Object.values(reviews).length > 0 ? (
                Object.values(reviews).
                sort((a, b) => b.date.toMillis() - a.date.toMillis()).
                map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{review.overallRating}</span>
                        <span className="text-sm italic text-muted-foreground">
                          {review.name}
                        </span>
                        <span className="text-sm italic text-muted-foreground">
                          {getDate(review)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Usefulness:</span>
                          <div className="font-medium">{review.usefulness}/5</div>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Easiness:</span>
                          <div className="font-medium">{review.easiness}/5</div>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Enjoyment:</span>
                          <div className="font-medium">{review.enjoyment}/5</div>
                        </div>
                      </div>
                      <p className="mb-4">{review.comments}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>Leave the first review!</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}