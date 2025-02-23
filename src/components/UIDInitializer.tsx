"use client";
import { useEffect } from "react";
import { getOrSetUID } from "@/lib/uid";

export default function UIDInitializer() {
  useEffect(() => {
    getOrSetUID();
  }, []);
  return null;
}