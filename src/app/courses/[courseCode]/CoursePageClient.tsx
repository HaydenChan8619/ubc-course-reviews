//@ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { ClientReviewDialog } from "@/components/ClientReviewDialog";
import { doc, getDoc } from "firebase/firestore";
import { toZonedTime, format } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import VoteButtons from "@/components/VoteButtons";
import { db } from "@/firebase/clientApp";
import { getOrSetUID } from "@/lib/uid";
import StarRating from "@/components/StarRating";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function CoursePageClient({ courseCode }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortCriteria, setSortCriteria] = useState("votes");
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

  if (loading) {
    return (
      <>
        <Navbar />
        <Head>
          <meta name="description" content="Loading course review..." />
        </Head>
        <div>Loading...</div>
      </>
    );
  }

  // If no course was found
  if (!course) {
    return (
      <>
        <Navbar />
        <Head>
          <meta name="description" content="Course not found - UBC Course Reviews" />
        </Head>
        <div>Pick Another Course!</div>
      </>
    );
  }

  const reviews = course.reviews;

  const getRating = (doc) => {
    let count = 0;
    let total = 0;
    if (!doc?.reviews) return 0;
    Object.values(doc.reviews).forEach((review) => {
      total += review.overallRating;
      count++;
    });
    return Math.round((total / count) * 100) / 100;
  };

  const getDate = (review) => {
    const timestamp = review.date;
    const date = timestamp.toDate();
    const timeZone = "America/Vancouver";
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, "yyyy-MM-dd", { timeZone });
  };

  const sortReviews = (entries) => {
    if (sortCriteria === "critical") {
      // Sort by overallRating ascending (lowest first) then by date (most recent first)
      return entries.sort(([, a], [, b]) => {
        if (a.overallRating === b.overallRating) {
          return b.date.toMillis() - a.date.toMillis();
        }
        return a.overallRating - b.overallRating;
      });
    } else if (sortCriteria === "comments") {
      // Prioritize reviews with non-empty comments; if both or neither, sort by date
      return entries.sort(([, a], [, b]) => {
        const aHasComment = a.comments && a.comments.trim() !== "";
        const bHasComment = b.comments && b.comments.trim() !== "";
        if (aHasComment === bHasComment) {
          return b.date.toMillis() - a.date.toMillis();
        }
        return aHasComment ? -1 : 1;
      });
    } else if (sortCriteria === "votes") {
      // Sort reviews by votes descending (highest first) and then by date (most recent first)
      return entries.sort(([, a], [, b]) => {
        if (a.votes === b.votes) {
          return b.date.toMillis() - a.date.toMillis();
        }
        return b.votes - a.votes;
      });
    } else {
      // Default sorting by most recent review
      return entries.sort(([, a], [, b]) => b.date.toMillis() - a.date.toMillis());
    }
  };

  // Create sorted entries from the reviews object
  const sortedReviewEntries =
    reviews && Object.entries(reviews).length > 0
      ? sortReviews(Object.entries(reviews))
      : [];

  return (
    <div className="relative">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button onClick={() => (window.location.href = "/courses")}>
              Back to Courses
            </Button>
            <h1 className="text-2xl md:text-4xl font-bold mb-2 mt-8">
              {course.code}
            </h1>
            <h2 className="text-xl md:text-2xl text-muted-foreground mb-4">
              {course.name}
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="text-lg md:text-xl font-medium">
                {getRating(course)}
              </span>
            </div>
            <Accordion
              type="single"
              collapsible
              className="w-full border border-gray-300 rounded-lg"
            >
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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h3 className="text-2xl font-bold mb-4 md:mb-0">Reviews</h3>
              <div className="flex items-center justify-between space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center text-left">
                        <span
                          className="block w-36 truncate text-left md:w-auto md:max-w-full md:overflow-visible md:whitespace-normal"
                        >
                        {sortCriteria === 'votes'
                            ? 'Sort by Most Upvotes'
                            : sortCriteria === 'critical'
                            ? 'Sort by Most Critical'
                            : sortCriteria === 'comments'
                            ? 'Sort by Prioritizing Comments'
                            : 'Sort by Most Recent'}
                        </span>
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSortCriteria("votes")}>
                        Sort by Most Upvotes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortCriteria("recent")}>
                        Sort by Most Recent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortCriteria("critical")}>
                        Sort by Most Critical
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortCriteria("comments")}>
                        Sort by Prioritizing Comments
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ClientReviewDialog courseCode={courseCode} />
                </div>
              </div>

            <div className="space-y-4">
              {sortedReviewEntries.length > 0 ? (
                sortedReviewEntries.map(([reviewId, review]) => (
                  <Card key={reviewId}>
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
                          {getDate(review)}
                        </span>
                      </div>
                      <div className="mb-4">
                        {/* Mobile view */}
                        <div className="flex flex-col gap-2 md:hidden">
                          <div className="flex items-center text-sm">
                            <span className="w-32 text-muted-foreground">
                              Usefulness:
                            </span>
                            <StarRating
                              rating={review.usefulness}
                              onChange={() => {}}
                              size="text-lg"
                            />
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="w-32 text-muted-foreground">
                              Ease of Learning:
                            </span>
                            <StarRating
                              rating={review.easiness}
                              onChange={() => {}}
                              size="text-lg"
                            />
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="w-32 text-muted-foreground">
                              Enjoyment:
                            </span>
                            <StarRating
                              rating={review.enjoyment}
                              onChange={() => {}}
                              size="text-lg"
                            />
                          </div>
                        </div>

                        {/* PC view */}
                        <div className="hidden md:grid md:grid-cols-3 md:gap-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Usefulness:
                            </span>
                            <div className="font-medium">
                              <StarRating
                                rating={review.usefulness}
                                onChange={() => {}}
                                size="text-lg"
                              />
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Ease of Learning:
                            </span>
                            <div className="font-medium">
                              <StarRating
                                rating={review.easiness}
                                onChange={() => {}}
                                size="text-lg"
                              />
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Enjoyment:
                            </span>
                            <div className="font-medium">
                              <StarRating
                                rating={review.enjoyment}
                                onChange={() => {}}
                                size="text-lg"
                              />
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
  );
}
