import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { RootFolderGetData, SubFolderGetData } from "../../folder/folder";
import { CollaboratorUserData, GeneralAccessData, ModalManageAccessContentState } from "@/features/collaborator/collaborator";
import {
  setCollaboratorsUserData,
  setContentWillRender,
  setFolderData,
  setGeneralData,
  setIsSecuredFolderActive,
  setModalManageAccess,
} from "@/features/collaborator/slice/modal-manage-access-content-slice";

interface UseModalManageAccessContentSetStateParams {
  withUseEffect?: {
    setModalContentWillRender?: ModalManageAccessContentState["contentWillRender"];
    setModalFolderData?: ModalManageAccessContentState["folderData"];
    setModalGeneralData?: ModalManageAccessContentState["generalData"];
    setModalCollaboratorsUserData?: ModalManageAccessContentState["collaboratorsUserData"];
    setIsSecuredFolderActive?: ModalManageAccessContentState["isSecuredFolderActive"];
  };
}
const useModalManageAccessContentSetState = ({ withUseEffect }: UseModalManageAccessContentSetStateParams) => {
  const dispatch = useDispatch();

  const setModalOpen = useCallback((data: boolean) => dispatch(setModalManageAccess(data)), [dispatch]);
  const setModalContentWillRender = useCallback(
    (data: ModalManageAccessContentState["contentWillRender"]) => dispatch(setContentWillRender(data)),
    [dispatch]
  );
  const setModalFolderData = useCallback((data: RootFolderGetData | SubFolderGetData) => dispatch(setFolderData(data)), [dispatch]);
  const setModalGeneralData = useCallback((data: GeneralAccessData) => dispatch(setGeneralData(data)), [dispatch]);
  const setModalCollaboratorsUserData = useCallback((data: CollaboratorUserData[] | null) => dispatch(setCollaboratorsUserData(data)), [dispatch]);
  const setSecuredFolderActive = useCallback((data: boolean) => dispatch(setIsSecuredFolderActive(data)), [dispatch]);

  /**
   * set data with useEffect
   */
  useEffect(() => {
    if (!withUseEffect) return;
    withUseEffect.setModalContentWillRender && setModalContentWillRender(withUseEffect.setModalContentWillRender);
    withUseEffect.setModalFolderData && setModalFolderData(withUseEffect.setModalFolderData);
    withUseEffect.setModalGeneralData && setModalGeneralData(withUseEffect.setModalGeneralData);
    withUseEffect.setModalCollaboratorsUserData && setModalCollaboratorsUserData(withUseEffect.setModalCollaboratorsUserData);
    withUseEffect.setIsSecuredFolderActive && setSecuredFolderActive(withUseEffect.setIsSecuredFolderActive);
  }, [setModalContentWillRender, setModalFolderData, setModalGeneralData, setModalCollaboratorsUserData, withUseEffect, setSecuredFolderActive]);

  return {
    setModalOpen,
    setModalContentWillRender,
    setModalFolderData,
    setModalGeneralData,
    setModalCollaboratorsUserData,
  };
};

export default useModalManageAccessContentSetState;
