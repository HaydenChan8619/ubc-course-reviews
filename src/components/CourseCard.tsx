'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Course } from "@/types/course";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
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
            <span className="font-medium">{course.rating.toFixed(1)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}