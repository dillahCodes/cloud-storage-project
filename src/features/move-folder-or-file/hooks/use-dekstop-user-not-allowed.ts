import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useDekstopUserNotAllowed = () => {
  const navigate = useNavigate();
  const { isDesktopDevice } = useGetClientScreenWidth();

  useEffect(() => {
    if (isDesktopDevice) navigate("/storage/my-storage");
  }, [isDesktopDevice, navigate]);
};

export default useDekstopUserNotAllowed;
