import { useState } from "react";

const useHover = () => {
  const [isHover, setIsHover] = useState<boolean>(false);

  const handleStartHover = () => setIsHover(true);
  const handleEndHover = () => setIsHover(false);

  return { isHover, handleStartHover, handleEndHover };
};

export default useHover;
