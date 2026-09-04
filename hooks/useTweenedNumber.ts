'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Smoothly interpolates a displayed number toward `target` over `durationMs`
 * on every change, instead of snapping (DESIGN-GUIDANCE.md section 7). Respects
 * prefers-reduced-motion by updating instantly with no animation frames.
 */
export function useTweenedNumber(target: number, durationMs = 180): number {
  const [displayed, setDisplayed] = useState(target);
  const frameRef = useRef<number | null>(null);
  const fromRef = useRef(target);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayed(target);
      fromRef.current = target;
      return;
    }

    const from = fromRef.current;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      setDisplayed(from + (target - from) * progress);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return displayed;
}
