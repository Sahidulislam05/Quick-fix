"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import AnimatedContent from "../AnimatedContent";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number; // সেকেন্ডে
  distance?: number; // কত পিক্সেল নিচ থেকে উঠবে
};

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 32,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  // "Reduce motion" চালু থাকলে অ্যানিমেশন ছাড়াই দেখাও
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatedContent
      distance={distance}
      duration={0.7}
      ease="power3.out"
      delay={delay}
      threshold={0.1}
    >
      <div className={className}>{children}</div>
    </AnimatedContent>
  );
}
