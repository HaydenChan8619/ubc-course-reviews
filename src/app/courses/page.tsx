import React, { Suspense } from 'react';
import CoursesPage from './CoursesPage';
import Head from 'next/head';
import { getCoursesData } from '@/lib/coursesData';

export const revalidate = 300;

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