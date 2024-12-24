import { useEffect, RefObject, useState } from "react";

interface ReturnUseClickOutside {
  isOpen: boolean;
}

interface UseClickOutsideProps {
  excludeELRef: RefObject<HTMLElement>;
  trigerElRef: RefObject<HTMLElement>;
}

const useClickOutside = (props: UseClickOutsideProps): ReturnUseClickOutside => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isTrigerElement = props.trigerElRef?.current?.contains(target);
      const isClickOutside = !props.excludeELRef.current?.contains(target);

      if (isTrigerElement) setIsOpen((prev) => !prev);
      else if (isClickOutside && isOpen) setIsOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, props.excludeELRef, props.trigerElRef]);

  return { isOpen };
};

export default useClickOutside;
