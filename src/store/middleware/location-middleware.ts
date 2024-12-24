import { clearFileUploading } from "@/features/file/slice/file-uploading-slice";
import { isAction, Middleware } from "@reduxjs/toolkit";
import { closeDrawerMenu } from "../slice/drawer-slice";

const locationMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  if (isAction(action)) {
    if (action.type === "@@router/LOCATION_CHANGE") {
      // close mobile drawer when location change
      storeAPI.dispatch(closeDrawerMenu());

      // clear uploading files when location change
      storeAPI.dispatch(clearFileUploading());
    }
  }

  return next(action);
};

export default locationMiddleware;
