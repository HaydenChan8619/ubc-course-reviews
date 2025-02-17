'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import StarRating from "./StarRating";
import { db } from "@/firebase/clientApp";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const reviewSchema = z.object({
  usefulness: z.number().min(1, { message: "Rating must be between 1 and 5" }).max(5, { message: "Rating must be between 1 and 5" }),
  easiness: z.number().min(1, { message: "Rating must be between 1 and 5" }).max(5, { message: "Rating must be between 1 and 5" }),
  enjoyment: z.number().min(1, { message: "Rating must be between 1 and 5" }).max(5, { message: "Rating must be between 1 and 5" }),
  comments: z.string().min(0, "Comment must be at least 0 characters long"),
  name: z.string().min(0, "Name must be at least 0 characters long"),
});

interface ReviewFormProps {
  courseCode: string;
  onSubmit: () => void;
}

async function updateDatabase (courseCode, data) {  
  const courseRef = doc(db, "courses", courseCode);
  const courseSnap = await getDoc(courseRef);

  // Get the current course data and review count (defaulting to 0 if not set)
  const courseData = courseSnap.data();

  const currentReviewCount = courseData.reviewCount || 0;

    // Create the new review ID based on reviewCount
    const newReviewId = `review-${currentReviewCount + 1}`;

    // Compute the overall rating as the average (rounded) of the three ratings
    const overallRating = Math.round(
      (Number(data.usefulness) + Number(data.easiness) + Number(data.enjoyment)) / 3
    );

    // Build the review object with the required fields.
    const review = {
      overallRating,            // number
      usefulness: Number(data.usefulness),  // number
      easiness: Number(data.easiness),      // number
      enjoyment: Number(data.enjoyment),      // number
      comments: data.comments,    // string
      name: data.name,            // string
      date: new Date().toISOString().split('T')[0], // string
      votes: 1,                   // number
    };

    // Update the course document: 
    // - Add the new review in the 'reviews' map (using dot notation).
    // - Update the reviewCount field.
    await updateDoc(courseRef, {
      [`reviews.${newReviewId}`]: review,
      reviewCount: currentReviewCount + 1,
    });

    console.log("Review submitted successfully.");
};

export function ReviewForm({ courseCode, onSubmit }: ReviewFormProps) {
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      usefulness: 0,
      easiness: 0,
      enjoyment: 0,
      comments: "",
      name: "",
    },
  });

  const router = useRouter();

  const handleSubmit = (values: z.infer<typeof reviewSchema>) => {
    const { usefulness, easiness, enjoyment } = values;
    const overallRating = (usefulness + easiness + enjoyment) / 3 ;
    
    // Here you would typically send the data to your backend
    console.log({ 
      ...values, 
      courseCode,
      ratings: {
        usefulness,
        easiness,
        enjoyment
      },
      overallRating
    });
    updateDatabase(courseCode, values).finally(() => {
      router.refresh();
    });
    
    onSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="usefulness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usefulness</FormLabel>
              <FormControl>
                <StarRating rating={field.value || 0} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="easiness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Easiness</FormLabel>
              <FormControl>
                <StarRating rating={field.value || 0} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enjoyment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enjoyment</FormLabel>
              <FormControl>
                <StarRating rating={field.value || 0} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment <i className="text-muted-foreground">(Optional)</i></FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name <i className="text-muted-foreground">(Optional)</i></FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Submit Review</Button>
      </form>
    </Form>
  );
}