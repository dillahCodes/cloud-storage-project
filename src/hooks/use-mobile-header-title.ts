import { HeaderMobileType, mobileHeaderTitleSelector, setMobileHeaderTitle } from "@/store/slice/mobile-header-title-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useMobileHeaderTitle = (title?: HeaderMobileType) => {
  const dispatch = useDispatch();
  const mobileHeaderTitleState = useSelector(mobileHeaderTitleSelector);

  useEffect(() => {
    if (title && mobileHeaderTitleState.title !== title) dispatch(setMobileHeaderTitle(title));
  }, [dispatch, mobileHeaderTitleState.title, title]);

  return { title: mobileHeaderTitleState.title };
};

export default useMobileHeaderTitle;
