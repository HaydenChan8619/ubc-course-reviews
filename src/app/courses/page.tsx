'use client';
import React, { Suspense } from 'react';
import CoursesPage from './CoursesPage';
import Head from 'next/head';

export default function Courses() {
  return (
    <>
      <Head>
          <meta
            name="description"
            content="UBC Course Reviews - full course list of all UBC Courses! Browse around to learn what others think about UBC Courses!"
          />
      </Head>
      <Suspense fallback={<div>Loading courses...</div>}>
        <CoursesPage />
      </Suspense>
    </>
  );
}