'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import { DocumentData } from "firebase/firestore";

interface CourseCardProps {
  course: DocumentData;
}

function getRating(doc: DocumentData): number {
  let count = 0;
  let total = 0;
  
  Object.values(doc.reviews).forEach((review: any) => {
    total += review.overallRating;
    count++;
  });

  return Math.round((total / count) * 100) / 100;
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