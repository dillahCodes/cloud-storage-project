import { useDispatch, useSelector } from "react-redux";
import { clearUser, setStatus, setUser, userSelector } from "../slice/user-slice";
import { AuthState, FirebaseUserData } from "../auth";

const useUser = () => {
  const dispatch = useDispatch();
  const userState = useSelector(userSelector);
  const { redirectUserTo, status, user } = userState;

  return {
    user,
    status,
    redirectUserTo,

    clearUser: () => dispatch(clearUser()),
    setUser: (userData: FirebaseUserData | null) => dispatch(setUser(userData)),
    setStatus: (status: AuthState["status"]) => dispatch(setStatus(status)),
  };
};

export default useUser;
