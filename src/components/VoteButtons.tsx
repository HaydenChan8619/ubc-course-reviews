// @ts-nocheck
"use client";
import { useState } from "react";
import { doc, updateDoc, increment, getDoc, deleteField } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { ArrowUp, ArrowDown } from "lucide-react";
import { getOrSetUID } from "@/lib/uid";

export default function VoteButtons({ courseCode, reviewId, initialVotes, initialUserVote }) {
  const [votes, setVotes] = useState(initialVotes);

  const currentUID = getOrSetUID();
  // Local state to track if the user has voted already for visual feedback.
  const [userVote, setUserVote] = useState(initialUserVote);

  const handleVote = async (voteType: number) => {
    try {
      const courseRef = doc(db, "courses", courseCode);
      const courseSnap = await getDoc(courseRef);
      const courseData = courseSnap.data();

      // Get the current review's data.
      const review = courseData.reviews[reviewId];
      const previousVote = review.voters ? review.voters[currentUID] || 0 : 0;
      let voteChange = 0;

      if (previousVote === voteType) {
        // User clicked the same button again: unvote.
        voteChange = -voteType;
        await updateDoc(courseRef, {
          [`reviews.${reviewId}.votes`]: increment(voteChange),
          [`reviews.${reviewId}.voters.${currentUID}`]: deleteField(),
        });
        setVotes(votes + voteChange);
        setUserVote(0);
        return;
      } else if (previousVote !== 0) {
        // Changing vote: subtract the previous vote then add the new vote.
        voteChange = voteType - previousVote;
      } else {
        voteChange = voteType;
      }

      // Update Firestore atomically.
      await updateDoc(courseRef, {
        [`reviews.${reviewId}.votes`]: increment(voteChange),
        [`reviews.${reviewId}.voters.${currentUID}`]: voteType,
      });

      // Update local state optimistically.
      setVotes(votes + voteChange);
      setUserVote(voteType);
    } catch (error) {
      console.error("Error processing vote:", error);
    }
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1 space-x-2 ${
        userVote === 1 ? "bg-green-600" : userVote === -1 ? "bg-red-600" : "bg-gray-300"}`}>
      <button onClick={() => handleVote(1)} className="hover:text-green-600">
        <ArrowUp
          strokeWidth={userVote === 1 ? 3 : 1}
          className={`h-6 w-6 ${userVote !== 0 ? "text-white" : ""}`}
        />
      </button>
      <span className="text-sm font-bold">{votes}</span>
      <button onClick={() => handleVote(-1)} className="hover:text-red-600">
        <ArrowDown
          strokeWidth={userVote === -1 ? 3 : 1}
          className={`h-6 w-6 ${userVote !== 0 ? "text-white" : ""}`}
        />
      </button>
    </div>
  );
}
