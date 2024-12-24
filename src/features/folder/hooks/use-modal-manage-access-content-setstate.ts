import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  ModalManageAccessContentState,
  setCollaboratorsUserData,
  setContentWillRender,
  setFolderData,
  setGeneralData,
  setModalManageAccess,
} from "../slice/modal-manage-access-content-slice";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import { CollaboratorUserData, GeneralAccessDataSerialized } from "../folder-collaborator";

interface UseModalManageAccessContentSetStateParams {
  withUseEffect?: {
    setModalContentWillRender?: ModalManageAccessContentState["contentWillRender"];
    setModalFolderData?: ModalManageAccessContentState["folderData"];
    setModalGeneralData?: ModalManageAccessContentState["generalData"];
    setModalCollaboratorsUserData?: ModalManageAccessContentState["collaboratorsUserData"];
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
  const setModalGeneralData = useCallback((data: GeneralAccessDataSerialized) => dispatch(setGeneralData(data)), [dispatch]);
  const setModalCollaboratorsUserData = useCallback(
    (data: CollaboratorUserData[] | null) => dispatch(setCollaboratorsUserData(data)),
    [dispatch]
  );

  /**
   * set data with useEffect
   */
  useEffect(() => {
    if (!withUseEffect) return;
    withUseEffect.setModalContentWillRender && setModalContentWillRender(withUseEffect.setModalContentWillRender);
    withUseEffect.setModalFolderData && setModalFolderData(withUseEffect.setModalFolderData);
    withUseEffect.setModalGeneralData && setModalGeneralData(withUseEffect.setModalGeneralData);
    withUseEffect.setModalCollaboratorsUserData && setModalCollaboratorsUserData(withUseEffect.setModalCollaboratorsUserData);
  }, [setModalContentWillRender, setModalFolderData, setModalGeneralData, setModalCollaboratorsUserData, withUseEffect]);

  return {
    setModalOpen,
    setModalContentWillRender,
    setModalFolderData,
    setModalGeneralData,
    setModalCollaboratorsUserData,
  };
};

export default useModalManageAccessContentSetState;
