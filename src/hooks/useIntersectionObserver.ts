import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Trigger animation every time section enters viewport
        if (isVisible) {
          // Reset animation first, then trigger it
          setShouldAnimate(false);
          setHasIntersected(true);
          
          // Small delay to ensure reset is applied before animation
          timeoutRef.current = setTimeout(() => {
            setShouldAnimate(true);
          }, 50);
        } else {
          // Reset animation when leaving viewport so it can animate again when scrolling back
          setShouldAnimate(false);
        }
      },
      { 
        threshold: 0.15, // Trigger when 15% of section is visible
        rootMargin: '-30px 0px', // Add some margin for better trigger timing
        ...options 
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [options]);

  return { ref: elementRef, isIntersecting, hasIntersected, shouldAnimate };
};