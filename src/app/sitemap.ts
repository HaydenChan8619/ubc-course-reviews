import { MetadataRoute } from "next";
import { getCoursesData } from '@/lib/coursesData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const courseData = await getCoursesData();
    const courseSites: MetadataRoute.Sitemap = Object.entries(courseData).map(([id, course]) => ({
        url: `https://www.ubccoursereviews.ca/courses/${course.code.toLowerCase().replace(/\s+/g, '-')}`,
        priority: 0.8
    }));
      
      

    return [
        {
            url: 'https://www.ubccoursereviews.ca',
            priority: 1.0
        },
        {
            url: 'https://www.ubccoursereviews.ca/courses',
            priority: 0.9
        },
        {
            url: 'https://www.ubccoursereviews.ca/about',
            priority: 0.2
        },
        ...courseSites
    ]
}