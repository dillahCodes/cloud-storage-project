import { useCallback, useEffect, useState } from "react";

interface UseScrollEndProps {
  scrollableElement: HTMLElement | null;
  offset: number;
}

/**
 * This hook detects when the scroll position of an element has reached the end
 * of its content. When the current scroll position is greater than or equal to
 * the offset, it will do something.
 *
 * @param offset - The distance from the bottom before it is considered "reached the bottom" (default: 200px)
 * @param scrollableElement - The scrollable element, make sure to pass in the scrollable element
 * @returns boolean
 */
const useScrollEnd = ({ offset = 200, scrollableElement }: UseScrollEndProps) => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = useCallback(() => {
    if (!scrollableElement) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
    const reachedBottom = scrollTop + clientHeight >= scrollHeight - offset;

    setIsAtBottom(reachedBottom);
  }, [scrollableElement, offset]);

  /**
   * add event listener to scrollable element
   */
  useEffect(() => {
    if (!scrollableElement) return;

    scrollableElement.addEventListener("scroll", handleScroll);
    return () => scrollableElement.removeEventListener("scroll", handleScroll);
  }, [handleScroll, scrollableElement]);

  return { isAtBottom };
};
export default useScrollEnd;
