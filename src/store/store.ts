import { authSlice } from "@/features/auth/slice/user-slice";
import { fileSlice } from "@/features/file/slice/file-slice";
import { fileUploadingSlice } from "@/features/file/slice/file-uploading-slice";
import { folderPermissionSlice } from "@/features/folder/slice/folder-permission-slice";
import { parentFolderSlice } from "@/features/folder/slice/parent-folder-slice";
import { configureStore } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import { createReduxHistoryContext } from "redux-first-history";
import drawerMiddleware from "./middleware/drawer-middleware";
import locationMiddleware from "./middleware/location-middleware";
import { drawerSlice } from "./slice/drawer-slice";
import { mobileHeaderTitleSlice } from "./slice/mobile-header-title-slice";
import { siderSlice } from "./slice/sider-slice";
import { breadcrumbSlice } from "@/features/breadcrumb/slice/breadcrumb-slice";
import { currentFoldersSlice } from "@/features/folder/slice/current-folders-slice";
import { mappingFolderTypeSlice } from "@/features/folder/slice/mapping-folder-type-slice";
import { mappingFileTypeSlice } from "@/features/file/slice/mapping-file-type-slice";
import { folderSortingTypeSlice } from "@/features/folder/slice/folder-sorting-type";
import { fileSortingTypeSlice } from "@/features/file/slice/file-sorting-type-slice";
import { modalManageAccessContentSlice } from "@/features/folder/slice/modal-manage-access-content-slice";
import { modalAddSelectedCollaboratorsSlice } from "@/features/folder/slice/modal-add-selected-collaborators";
import { messageSlice } from "@/features/message/slice/message-slice";
import { selectedMessageSlice } from "@/features/message/slice/selected-message-slice";
import { currentMessageSlice } from "@/features/message/slice/current-message-slice";

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
  savePreviousLocations: 0,
});

export const store = configureStore({
  reducer: {
    router: routerReducer,

    auth: authSlice.reducer,

    // ui slices
    drawer: drawerSlice.reducer,
    sider: siderSlice.reducer,
    mobileHeaderTitle: mobileHeaderTitleSlice.reducer,
    breadcrumb: breadcrumbSlice.reducer,
    modalManageAccessContent: modalManageAccessContentSlice.reducer,
    modalAddSelectedCollaborators: modalAddSelectedCollaboratorsSlice.reducer,

    // file and folder
    currentFolders: currentFoldersSlice.reducer,
    folderPermission: folderPermissionSlice.reducer,
    parentFolder: parentFolderSlice.reducer,
    file: fileSlice.reducer,
    fileUploading: fileUploadingSlice.reducer,

    // mapping type
    mappingFolderType: mappingFolderTypeSlice.reducer,
    mappingFileType: mappingFileTypeSlice.reducer,

    // sorting type
    folderSortingType: folderSortingTypeSlice.reducer,
    fileSortingType: fileSortingTypeSlice.reducer,

    // message/notification
    message: messageSlice.reducer,
    selectedMessage: selectedMessageSlice.reducer,
    currentMessage: currentMessageSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {},
    }).concat(routerMiddleware, locationMiddleware, drawerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const history = createReduxHistory(store);
