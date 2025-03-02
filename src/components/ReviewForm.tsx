// @ts-nocheck
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
import { toZonedTime, format } from 'date-fns-tz';
import { names } from "@/lib/names";

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

function generateName() {
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

async function updateDatabase (courseCode, data) {  
  const courseRef = doc(db, "courses", courseCode);
  const courseSnap = await getDoc(courseRef);
  const courseData = courseSnap.data();
  
  const currentReviewCount = courseData.reviewCount || 0;
  const newReviewId = `review-${currentReviewCount + 1}`;

  const overallRating = Math.round((Number(data.usefulness) + Number(data.easiness) + Number(data.enjoyment)) / 3);
  const authorName = data.name == "" ? generateName() : data.name;

  const review = {
    overallRating,
    usefulness: Number(data.usefulness),
    easiness: Number(data.easiness),
    enjoyment: Number(data.enjoyment),
    comments: data.comments,
    name: authorName,
    date: toZonedTime(new Date(),'America/Vancouver'),
    votes: 1,
  };

  await updateDoc(courseRef, {
      [`reviews.${newReviewId}`]: review,
      reviewCount: currentReviewCount + 1,
  });
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
    updateDatabase(courseCode, values).finally(() => {
      window.location.reload();
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
              <FormLabel>Usefulness <i className="text-muted-foreground">(1 for Useless, 5 for Super Useful)</i></FormLabel>
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
              <FormLabel>Difficulty <i className="text-muted-foreground">(1 for Super Hard, 5 for Super Easy)</i></FormLabel>
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
              <FormLabel>Enjoyment <i className="text-muted-foreground">(1 for Very Boring, 5 for Very Enjoyable)</i></FormLabel>
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