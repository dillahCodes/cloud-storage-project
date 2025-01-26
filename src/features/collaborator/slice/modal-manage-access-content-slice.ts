import { ModalManageAccessContentState } from "@/features/collaborator/collaborator";
import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ModalManageAccessContentState = {
  isModalManageAccessOpen: false,
  contentWillRender: "manage-access",
  folderData: null,
  collaboratorsUserData: null,
  generalData: null,
  isSecuredFolderActive: false,
};

export const modalManageAccessContentSlice = createSlice({
  name: "modalManageAccessContent",
  initialState,
  reducers: {
    setModalManageAccess: (state, action: PayloadAction<ModalManageAccessContentState["isModalManageAccessOpen"]>) => {
      state.isModalManageAccessOpen = action.payload;
    },
    setContentWillRender: (state, action: PayloadAction<ModalManageAccessContentState["contentWillRender"]>) => {
      state.contentWillRender = action.payload;
    },
    setFolderData: (state, action: PayloadAction<ModalManageAccessContentState["folderData"]>) => {
      state.folderData = action.payload;
    },
    setGeneralData: (state, action: PayloadAction<ModalManageAccessContentState["generalData"]>) => {
      state.generalData = action.payload;
    },
    setCollaboratorsUserData: (state, action: PayloadAction<ModalManageAccessContentState["collaboratorsUserData"]>) => {
      state.collaboratorsUserData = action.payload;
    },
    setIsSecuredFolderActive: (state, action: PayloadAction<ModalManageAccessContentState["isSecuredFolderActive"]>) => {
      state.isSecuredFolderActive = action.payload;
    },
  },
});

export const { setContentWillRender, setCollaboratorsUserData, setFolderData, setGeneralData, setModalManageAccess, setIsSecuredFolderActive } =
  modalManageAccessContentSlice.actions;
export const modalManageAccessContentSelector = (state: RootState) => state.modalManageAccessContent;
