import { useLocation } from "react-router-dom";

const useIsLocationActive = () => {
  const location = useLocation();
  const handleIsLocationActive = (path: string): boolean => {
    if (path.startsWith("/")) return location.pathname === path;
    return location.pathname.includes(path);
  };
  return { handleIsLocationActive };
};

export default useIsLocationActive;
