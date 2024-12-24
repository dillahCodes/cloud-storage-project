import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import { CollaboratorUserData, GeneralAccessDataSerialized } from "../folder-collaborator";

type ContentWillRender = "manage-access" | "add-persons";

export interface ModalManageAccessContentState {
  isModalManageAccessOpen: boolean;
  contentWillRender: ContentWillRender;
  folderData: RootFolderGetData | SubFolderGetData | null;
  generalData: GeneralAccessDataSerialized | null;
  collaboratorsUserData: CollaboratorUserData[] | null;
}

export const initialState: ModalManageAccessContentState = {
  isModalManageAccessOpen: false,
  contentWillRender: "manage-access",
  folderData: null,
  collaboratorsUserData: null,
  generalData: null,
};

export const modalManageAccessContentSlice = createSlice({
  name: "modalManageAccessContent",
  initialState,
  reducers: {
    setModalManageAccess: (state, action: PayloadAction<boolean>) => {
      state.isModalManageAccessOpen = action.payload;
    },
    setContentWillRender: (state, action: PayloadAction<ContentWillRender>) => {
      state.contentWillRender = action.payload;
    },
    setFolderData: (state, action: PayloadAction<RootFolderGetData | SubFolderGetData>) => {
      state.folderData = action.payload;
    },
    setGeneralData: (state, action: PayloadAction<GeneralAccessDataSerialized>) => {
      state.generalData = action.payload;
    },
    setCollaboratorsUserData: (state, action: PayloadAction<CollaboratorUserData[] | null>) => {
      state.collaboratorsUserData = action.payload;
    },
  },
});

export const { setContentWillRender, setCollaboratorsUserData, setFolderData, setGeneralData, setModalManageAccess } =
  modalManageAccessContentSlice.actions;
export const modalManageAccessContentSelector = (state: RootState) => state.modalManageAccessContent;
export const modalManageAccessContentReducer = modalManageAccessContentSlice.reducer;
