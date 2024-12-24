import { isAction, Middleware } from "@reduxjs/toolkit";
import { setDesktopDrawerFolderId } from "../slice/drawer-slice";

const drawerMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  if (isAction(action)) {
    if (action.type === "drawerSlice/toggleDesktopDrawerMenu") {
      storeAPI.dispatch(setDesktopDrawerFolderId(""));
    }
  }

  return next(action);
};

export default drawerMiddleware;
