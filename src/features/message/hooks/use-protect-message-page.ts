import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UseProtectMessagePageProps {
  shouldNavigate: boolean;
  navigateTo: string;
}
const useProtectMessagePage = ({ navigateTo, shouldNavigate }: UseProtectMessagePageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldNavigate) navigate(navigateTo, { replace: true });
  }, [navigate, navigateTo, shouldNavigate]);
};

export default useProtectMessagePage;
