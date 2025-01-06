import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useDekstopUserNotAllowed = () => {
  const navigate = useNavigate();
  const { isDesktopDevice, isTabletDevice } = useGetClientScreenWidth();

  useEffect(() => {
    if (isDesktopDevice || isTabletDevice) navigate("/storage/my-storage");
  }, [isDesktopDevice, isTabletDevice, navigate]);
};

export default useDekstopUserNotAllowed;
