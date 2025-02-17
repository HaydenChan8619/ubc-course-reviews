'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Course } from "@/types/course";
import Link from "next/link";
import { DocumentData } from "firebase/firestore";

interface CourseCardProps {
  course: DocumentData;
}

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

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.code.toLowerCase().replace(' ', '-')}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <h3 className="font-bold text-lg">{course.code}</h3>
          <p className="text-muted-foreground">{course.name}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{getRating(course)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}