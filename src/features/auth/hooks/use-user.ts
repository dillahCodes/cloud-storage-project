import { useDispatch, useSelector } from "react-redux";
import {
  clearUser as clearUserAction,
  setStatus as setStatusAction,
  setUser as setUserAction,
  userSelector,
} from "../slice/user-slice";
import { useCallback } from "react";

const useUser = () => {
  const dispatch = useDispatch();
  const userState = useSelector(userSelector);
  const { redirectUserTo, status, user } = userState;

  const setUser = useCallback((user: FirebaseUserData | null) => dispatch(setUserAction(user)), [dispatch]);
  const clearUser = useCallback(() => dispatch(clearUserAction()), [dispatch]);
  const setStatus = useCallback((status: AuthState["status"]) => dispatch(setStatusAction(status)), [dispatch]);

  return {
    user,
    status,
    redirectUserTo,

    setUser,
    clearUser,
    setStatus,
  };
};

export default useUser;
