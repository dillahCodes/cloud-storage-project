import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchInputValue } from "../slice/search-bar-slice";

const useSearch = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>("");

  /**
   * handle input change and run debounced function
   */
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    debouncedFn(event.target.value);
  };

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

  return { handleSearchInputChange, inputValue, setInputValue };
};

export default useSearch;
