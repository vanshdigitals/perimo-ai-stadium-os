import { useEffect, useState } from 'react';

/** True once the page has scrolled past `threshold` pixels — used to trigger
 *  header shadow/background transitions without doing per-frame work. */
export function useScrollThreshold(threshold = 20): boolean {
  const [past, setPast] = useState(() => (typeof window !== 'undefined' ? window.scrollY > threshold : false));

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setPast(window.scrollY > threshold);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return past;
}
