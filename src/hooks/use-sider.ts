import { closeSider, openSider, siderSelector, SiderState, toggleSider } from "@/store/slice/sider-slice";
import { useDispatch, useSelector } from "react-redux";

interface UseSiderReturn {
  siderState: SiderState;
  openSider: () => void;
  closeSider: () => void;
  toggleSider: () => void;
}

const useSider = (): UseSiderReturn => {
  const dispatch = useDispatch();
  const siderState = useSelector(siderSelector);

  return {
    siderState,
    openSider: () => dispatch(openSider()),
    closeSider: () => dispatch(closeSider()),
    toggleSider: () => dispatch(toggleSider()),
  };
};

export default useSider;
