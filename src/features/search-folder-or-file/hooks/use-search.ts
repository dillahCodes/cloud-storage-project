import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setSearchInputValue } from "../slice/search-bar-slice";

const useSearch = () => {
  const dispatch = useDispatch();

  /**
   * handle input change and run debounced function
   */
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => debouncedFn(event.target.value);

  /**
   * debounced function for dispatch event in 300ms after user stop typing
   */
  const debouncedFn = useMemo(() => {
    return debounce((value: string) => {
      dispatch(setSearchInputValue(value));
    }, 300);
  }, [dispatch]);

  /**
   * clean up debounced function on unmount
   */
  useEffect(() => {
    return () => debouncedFn.cancel();
  }, [debouncedFn]);

  return { handleSearchInputChange };
};

export default useSearch;
