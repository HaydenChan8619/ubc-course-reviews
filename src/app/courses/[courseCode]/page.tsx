// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { ClientReviewDialog } from "@/components/ClientReviewDialog";
import { doc, getDoc } from "firebase/firestore";
import { toZonedTime, format } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import VoteButtons from "@/components/VoteButtons";
import { db } from "@/firebase/clientApp";
import { getOrSetUID } from "@/lib/uid";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import Head from "next/head";

function getRating(doc) {
  let count = 0;
  let total = 0;

  if (!doc?.reviews) return 0;

  Object.values(doc.reviews).forEach((review) => {
    total += review.overallRating;
    count++;
  });

  return Math.round((total / count) * 100) / 100;
}

function getDate(doc) {
  const timestamp = doc.date;
  const date = timestamp.toDate();
  const timeZone = "America/Vancouver";
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy-MM-dd", { timeZone });
}

export default function CoursePage({ params }) {
  const { courseCode } = params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const userUID = getOrSetUID();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseDocRef = doc(db, "courses", courseCode);
        const courseDocSnap = await getDoc(courseDocRef);
        setCourse(courseDocSnap.data());
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseCode]);

  const reviews = course.reviews;

  if (loading) {
    return (
      <>
        <Head>
          <meta name="description" content="Loading course review..." />
        </Head>
        <div></div>
      </>
    );
  }

  // Course not found state
  if (!course) {
    return (
      <>
        <Head>
          <meta name="description" content="Course not found - UBC Course Reviews" />
        </Head>
        <div>Pick Another Course!</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <meta name="description" content={`UBC Course Review - ${course.code}: ${course.name}`} />
      </Head>
      <div className="relative">
        <Navbar/>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Button onClick={() => window.location.href='/courses'}>Back to Courses</Button>
              <h1 className="text-2xl md:text-4xl font-bold mb-2 mt-8">{course.code}</h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground mb-4">{course.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                <span className="text-lg md:text-xl font-medium">{getRating(course)}</span>
              </div>
              <Accordion type="single" collapsible className="w-full border border-gray-300 rounded-lg">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-md md:text-lg font-bold pl-4">
                    Course Description
                  </AccordionTrigger>
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
                {reviews && Object.entries(reviews).length > 0 ? (
                  Object.entries(reviews)
                    .sort(([, a], [, b]) => b.date.toMillis() - a.date.toMillis())
                    .map(([reviewId, review]) => (
                        <Card key={reviewId}>
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
                            <div className="mb-4">
                              {/* Mobile view: flex layout with aligned labels */}
                              <div className="flex flex-col gap-2 md:hidden">
                                <div className="flex items-center text-sm">
                                  <span className="w-32 text-muted-foreground">Usefulness:</span>
                                  <StarRating rating={review.usefulness} onChange={() => {}} size="text-lg" />
                                </div>
                                <div className="flex items-center text-sm">
                                  <span className="w-32 text-muted-foreground">Ease of Learning:</span>
                                  <StarRating rating={review.easiness} onChange={() => {}} size="text-lg" />
                                </div>
                                <div className="flex items-center text-sm">
                                  <span className="w-32 text-muted-foreground">Enjoyment:</span>
                                  <StarRating rating={review.enjoyment} onChange={() => {}} size="text-lg" />
                                </div>
                              </div>

                              {/* PC view (md and up): grid layout */}
                              <div className="hidden md:grid md:grid-cols-3 md:gap-4">
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Usefulness:</span>
                                  <div className="font-medium">
                                    <StarRating rating={review.usefulness} onChange={() => {}} size="text-lg"/>
                                  </div>
                                </div>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Ease of Learning:</span>
                                  <div className="font-medium">
                                    <StarRating rating={review.easiness} onChange={() => {}} size="text-lg"/>
                                  </div>
                                </div>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Enjoyment:</span>
                                  <div className="font-medium">
                                    <StarRating rating={review.enjoyment} onChange={() => {}} size="text-lg"/>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <p className="mb-4">{review.comments}</p>
                            <VoteButtons
                              courseCode={courseCode}
                              reviewId={reviewId}
                              initialVotes={review.votes}
                              initialUserVote={review.voters?.[userUID] || 0}
                            />
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
    </>
  );
}