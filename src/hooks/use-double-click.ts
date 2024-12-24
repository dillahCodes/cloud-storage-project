import { useEffect, useRef, useState } from "react";

const useDoubleClick = <T>(
  onDoubleClick?: (item?: T) => void, // Make the parameter optional
  delay: number = 300
) => {
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const itemRef = useRef<T | null>(null);

  const handleClick = (item: T) => {
    itemRef.current = item; // Store the item to pass it to onDoubleClick
    setClickCount((prev) => prev + 1);

    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Set a new timer
    timerRef.current = setTimeout(() => {
      setClickCount(0); // Reset click count after delay
    }, delay);

    // Check for double click
    if (clickCount + 1 === 2) {
      if (onDoubleClick) {
        // Call onDoubleClick only if it's defined
        onDoubleClick(itemRef.current); // Pass the item data
      }
      setClickCount(0); // Reset count after double click
      clearTimeout(timerRef.current!); // Clear timer
    }
  };

  useEffect(() => {
    // Cleanup function to clear timer on unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return handleClick;
};

export default useDoubleClick;
