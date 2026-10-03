import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If IntersectionObserver is not supported, reveal immediately
    if (!('IntersectionObserver' in window)) {
      element.classList.add('reveal-visible');
      return;
    }

    let isRevealed = false;

    // 1.5s Safety fallback: ensure element is never stuck hidden during live demos
    const fallbackTimer = setTimeout(() => {
      if (!isRevealed && element) {
        element.classList.add('reveal-visible');
        isRevealed = true;
        if (observer) {
          observer.unobserve(element);
        }
      }
    }, 1500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isRevealed = true;
            clearTimeout(fallbackTimer);
            entry.target.classList.add('reveal-visible');
            // Unobserve after revealing once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [options]);

  return ref;
}
