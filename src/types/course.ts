export interface Course {
    code: string;
    name: string;
    rating: number;
    description: string;
  }
  
  export interface ReviewRatings {
    usefulness: number;
    easiness: number;
    enjoyment: number;
  }
  
  export interface Review {
    id: string;
    courseCode: string;
    ratings: ReviewRatings;
    overallRating: number;
    comment: string;
    authorName: string;
    createdAt: Date;
  }