//@ts-nocheck
import { Metadata } from "next";
import CoursePageClient from "./CoursePageClient";

export async function generateMetadata({ params }): Promise<Metadata> {
  const parts = params.courseCode.split("-");
  const formattedCourseCode = parts.length === 2 ? `${parts[0].toUpperCase()} ${parts[1]}` : params.courseCode;
  return {
    title: `${formattedCourseCode} Reviews`
  };
}

export default function CoursePage({ params }) {
  return (
    <CoursePageClient courseCode={params.courseCode} />
  );
}
