import { useRef } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

interface ScrollAnimationConfig {
  offset?: ("start end" | "end start")[];
  threshold?: number;
}

/**
 * Hook for scroll-triggered animations
 * Returns scroll progress value that can be used with useTransform
 */
export function useScrollAnimation(config: ScrollAnimationConfig = {}) {
  const { offset = ["start end", "end start"], threshold = 0.1 } = config;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ("start end" | "end start")[],
  });

  return { ref, scrollYProgress };
}

/**
 * Common scroll animation transforms
 */
export const scrollAnimations = {
  // Fade in on scroll
  fadeIn: (scrollProgress: MotionValue<number>) =>
    useTransform(scrollProgress, [0, 1], [0, 1]),

  // Slide up on scroll
  slideUp: (scrollProgress: MotionValue<number>) =>
    useTransform(scrollProgress, [0, 1], [100, 0]),

  // Slide down on scroll
  slideDown: (scrollProgress: MotionValue<number>) =>
    useTransform(scrollProgress, [0, 1], [-100, 0]),

  // Slide left on scroll
  slideLeft: (scrollProgress: MotionValue<number>) =>
    useTransform(scrollProgress, [0, 1], [100, 0]),

  // Slide right on scroll
  slideRight: (scrollProgress: MotionValue<number>) =>
    useTransform(scrollProgress, [0, 1], [-100, 0]),

  // Scale on scroll
  scale: (scrollProgress: MotionValue<number>) =>
    useTransform(scrollProgress, [0, 1], [0.8, 1]),

  // Rotate on scroll
  rotate: (scrollProgress: MotionValue<number>) =>
    useTransform(scrollProgress, [0, 1], [-10, 0]),

  // Blur on scroll
  blur: (scrollProgress: MotionValue<number>) =>
    useTransform(scrollProgress, [0, 1], [10, 0]),
};
