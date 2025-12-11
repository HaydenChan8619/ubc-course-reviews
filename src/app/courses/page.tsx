import React, { Suspense } from 'react';
import CoursesPage from '../CoursesPage';
import Head from 'next/head';
import { getCoursesData } from '@/lib/coursesData';
import { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `UBC Course List`,
    description: 'UBC Course Reviews is the best place to learn more about courses at UBC, and leave your thoughts about the courses you have taken.'
  };
}

export default async function Courses() {
  const coursesData = await getCoursesData();
  return (
    <>
      <Head>
          <meta
            name="description"
            content="UBC Course Reviews - full course list of all UBC Courses! Browse around to learn what others think about UBC Courses!"
          />
      </Head>
      <Suspense fallback={<div>Loading courses...</div>}>
        <CoursesPage coursesData={coursesData}/>
      </Suspense>
    </>
  );
}