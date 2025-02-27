'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ReviewForm } from "./ReviewForm";
import { useRouter } from "next/navigation";

interface ClientReviewDialogProps {
  courseCode: string;
}

export function ClientReviewDialog({ courseCode }: ClientReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <ReviewForm 
          courseCode={courseCode} 
          onSubmit={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}