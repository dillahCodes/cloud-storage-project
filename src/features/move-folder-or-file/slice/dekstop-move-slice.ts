import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DekstopMoveState } from "../move-folder-or-file";
import { RootState } from "@/store/store";

const initialState: DekstopMoveState = {
  isModalOpen: false,
  isModalMoveButtonDisabled: false,

  parentFolderId: null,

  locationParentFolderId: null,
  locationParentFolderName: null,

  folderId: null,
  folderName: null,

  fileId: null,
  fileName: null,
  fileType: null,

  folderMovePermission: {
    canCRUD: true,
    canView: true,
    canManageAccess: true,
  },

  dekstopMoveStatus: "idle",
};

export const dekstopMoveSlice = createSlice({
  name: "dekstopMove",
  initialState,
  reducers: {
    /**
     * modal reducers
     */
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },

    /**
     * button disabled reducers
     */
    setModalMoveButtonDisabled: (state, action: PayloadAction<DekstopMoveState["isModalMoveButtonDisabled"]>) => {
      state.isModalMoveButtonDisabled = action.payload;
    },

    /**
     * parent folder data reducers
     */
    setMoveParentFolderId: (state, action: PayloadAction<DekstopMoveState["parentFolderId"]>) => {
      state.parentFolderId = action.payload;
    },

    /**
     * parent folder location data reducers
     */
    setMoveParentFolderLocationData: (
      state,
      action: PayloadAction<Pick<DekstopMoveState, "locationParentFolderId" | "locationParentFolderName">>
    ) => {
      state.locationParentFolderId = action.payload.locationParentFolderId;
      state.locationParentFolderName = action.payload.locationParentFolderName;
    },

    /**
     * folder data reducers
     */
    dekstopMoveSetFolderData: (state, action: PayloadAction<Pick<DekstopMoveState, "folderId" | "folderName">>) => {
      state.folderId = action.payload.folderId;
      state.folderName = action.payload.folderName;
    },

    /**
     * file data reducers
     */
    dekstopMoveSetFileData: (state, action: PayloadAction<Pick<DekstopMoveState, "fileId" | "fileName" | "fileType">>) => {
      state.fileId = action.payload.fileId;
      state.fileName = action.payload.fileName;
      state.fileType = action.payload.fileType;
    },

    /**
     * dekstop move status reducers
     */
    setDekstopMoveStatus: (state, action: PayloadAction<DekstopMoveState["dekstopMoveStatus"]>) => {
      state.dekstopMoveStatus = action.payload;
    },

    /**
     * dekstop permission reducers
     */
    setFolderMovePermission: (state, action: PayloadAction<DekstopMoveState["folderMovePermission"]>) => {
      state.folderMovePermission = action.payload;
    },

    resetDektopMoveState: () => initialState,
  },
});

export const {
  openModal,
  closeModal,
  toggleModal,
  dekstopMoveSetFileData,
  dekstopMoveSetFolderData,
  setModalMoveButtonDisabled,
  resetDektopMoveState,
  setMoveParentFolderId,
  setMoveParentFolderLocationData,
  setDekstopMoveStatus,
  setFolderMovePermission,
} = dekstopMoveSlice.actions;
export const dekstopMoveSelector = (state: RootState) => state.dekstopMove;
export default dekstopMoveSlice.reducer;
