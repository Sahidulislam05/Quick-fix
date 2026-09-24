"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import CountUp from "../CountUp";

type AnimatedNumberProps = {
  value: number;
  className?: string;
};

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={className}>{value.toLocaleString("en-US")}</span>;
  }

  return (
    <CountUp to={value} separator="," duration={2} className={className} />
  );
}
