import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface UseGetClientScreenWidthReturn {
  screenWidth: number;
  isMobileDevice: boolean;
  isTabletDevice: boolean;
  isDesktopDevice: boolean;
}

const useGetClientScreenWidth = (): UseGetClientScreenWidthReturn => {
  const [screenWidth, setScreenWidth] = useState<number>(Math.floor(window.innerWidth));

  const isDesktopDevice = useMediaQuery({
    minWidth: 1025,
  });

  const isTabletDevice = useMediaQuery({
    minWidth: 768,
    maxWidth: 1024,
  });

  const isMobileDevice = useMediaQuery({
    maxWidth: 767,
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      const width = Math.floor(window.innerWidth);
      setScreenWidth(width);
    }, 1000);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      debouncedHandleResize.cancel();
    };
  }, []);

  return { screenWidth, isMobileDevice, isTabletDevice, isDesktopDevice };
};

export default useGetClientScreenWidth;
