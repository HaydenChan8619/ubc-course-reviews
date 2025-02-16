'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const reviewSchema = z.object({
  usefulness: z.string().transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 5, {
      message: "Rating must be between 1 and 5",
    }),
  easiness: z.string().transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 5, {
      message: "Rating must be between 1 and 5",
    }),
  enjoyment: z.string().transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 5, {
      message: "Rating must be between 1 and 5",
    }),
  comment: z.string().min(10, "Comment must be at least 10 characters long"),
  authorName: z.string().min(2, "Name must be at least 2 characters long"),
});

interface ReviewFormProps {
  courseCode: string;
  onSubmit: () => void;
}

export function ReviewForm({ courseCode, onSubmit }: ReviewFormProps) {
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      usefulness: "",
      easiness: "",
      enjoyment: "",
      comment: "",
      authorName: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof reviewSchema>) => {
    const { usefulness, easiness, enjoyment } = values;
    const overallRating = Math.round((usefulness + easiness + enjoyment) / 3 * 2) / 2;
    
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
              <FormLabel>Usefulness (1-5)</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="5" {...field} />
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
              <FormLabel>Easiness (1-5)</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="5" {...field} />
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
              <FormLabel>Enjoyment (1-5)</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
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