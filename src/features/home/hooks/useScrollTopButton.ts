import { useEffect, useRef, useState } from "react";

const SCROLL_DIRECTION_THRESHOLD = 20;

export function useScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const previousScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const previousScrollY = previousScrollYRef.current;
      const isOverFirstView = currentScrollY > viewportHeight;
      const isScrollingUp = previousScrollY - currentScrollY > SCROLL_DIRECTION_THRESHOLD;
      const isScrollingDown = currentScrollY > previousScrollY;

      if (!isOverFirstView || isScrollingDown) {
        setIsVisible(false);
      }

      if (isOverFirstView && isScrollingUp) {
        setIsVisible(true);
      }

      previousScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { isVisible, scrollToTop };
}
