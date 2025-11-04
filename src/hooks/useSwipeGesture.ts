/**
 * Custom hook for mobile swipe gesture detection
 */

import { useEffect, useRef, RefObject } from "react";

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minSwipeDistance?: number; // Minimum distance in pixels to trigger swipe
  maxSwipeTime?: number; // Maximum time in ms for gesture to be considered a swipe
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export function useSwipeGesture<T extends HTMLElement>(
  options: SwipeGestureOptions
): RefObject<T> {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance = 50,
    maxSwipeTime = 300,
  } = options;

  const elementRef = useRef<T>(null);
  const touchStart = useRef<TouchPosition | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const touchEnd: TouchPosition = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      const deltaX = touchEnd.x - touchStart.current.x;
      const deltaY = touchEnd.y - touchStart.current.y;
      const deltaTime = touchEnd.time - touchStart.current.time;

      // Check if gesture was quick enough
      if (deltaTime > maxSwipeTime) {
        touchStart.current = null;
        return;
      }

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Determine swipe direction
      if (absX > absY) {
        // Horizontal swipe
        if (absX >= minSwipeDistance) {
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (absY >= minSwipeDistance) {
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }

      touchStart.current = null;
    };

    const handleTouchCancel = () => {
      touchStart.current = null;
    };

    // Add event listeners
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });
    element.addEventListener("touchcancel", handleTouchCancel, { passive: true });

    // Cleanup
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minSwipeDistance, maxSwipeTime]);

  return elementRef;
}

/**
 * Hook for horizontal swipe only (useful for navigation)
 */
export function useHorizontalSwipe<T extends HTMLElement>(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  minSwipeDistance: number = 50
): RefObject<T> {
  return useSwipeGesture<T>({
    onSwipeLeft,
    onSwipeRight,
    minSwipeDistance,
  });
}

/**
 * Hook for vertical swipe only (useful for scrolling)
 */
export function useVerticalSwipe<T extends HTMLElement>(
  onSwipeUp: () => void,
  onSwipeDown: () => void,
  minSwipeDistance: number = 50
): RefObject<T> {
  return useSwipeGesture<T>({
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance,
  });
}
