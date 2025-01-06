import {
  closeDesktopDrawerMenu,
  closeDrawerMenu,
  DesktopDrawerTitleType,
  drawerSelector,
  DrawerState,
  openDesktopDrawerMenu,
  openDrawerMenu,
  resetDrawerState,
  setDesktopDrawerFolderId,
  setDesktopDrawerTitle,
  toggleDesktopDrawerMenu,
  toggleDrawerMenu,
} from "@/store/slice/drawer-slice";
import { useDispatch, useSelector } from "react-redux";

interface UseDrawerReturn {
  drawerState: DrawerState;
  openDrawerMenu: () => void;
  closeDrawerMenu: () => void;
  toggleDrawerMenu: () => void;
  openDrawerDesktop: () => void;
  closeDrawerDesktop: () => void;
  toggleDrawerDekstop: () => void;
  setDrawerDesktopTitle: (title: DesktopDrawerTitleType) => void;
  setDrawerDesktopFolderId: (id: string) => void;
}

const useDrawer = (): UseDrawerReturn => {
  const dispatch = useDispatch();
  const drawerState = useSelector(drawerSelector);
  return {
    drawerState,
    openDrawerMenu: () => dispatch(openDrawerMenu()),
    closeDrawerMenu: () => dispatch(closeDrawerMenu()),
    toggleDrawerMenu: () => dispatch(toggleDrawerMenu()),

    openDrawerDesktop: () => dispatch(openDesktopDrawerMenu()),
    closeDrawerDesktop: () => dispatch(closeDesktopDrawerMenu()),
    toggleDrawerDekstop: () => {
      dispatch(toggleDesktopDrawerMenu());
      drawerState.isDrawerMenuOpen && dispatch(resetDrawerState());
    },

    setDrawerDesktopTitle: (title: DesktopDrawerTitleType) => dispatch(setDesktopDrawerTitle(title)),
    setDrawerDesktopFolderId: (id: string) => dispatch(setDesktopDrawerFolderId(id)),
  };
};

export default useDrawer;
