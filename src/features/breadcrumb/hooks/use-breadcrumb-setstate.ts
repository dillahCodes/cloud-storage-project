import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  addBreadcrumbItem,
  addBreadcrumbItems,
  addBreadcrumbItemWithIndex,
  deleteBreadcrumbItemsByKey,
  deleteUnusedBreadcrumbItems,
  resetBreadcrumb,
  setFirstIndexBreadcrumbItem,
  setStatusBreadcrumb,
} from "../slice/breadcrumb-slice";

const useBreadcrumbSetState = () => {
  const dispatch = useDispatch();

  const setStatus = useCallback((status: BreadcrumbItemFetchStatus) => dispatch(setStatusBreadcrumb(status)), [dispatch]);
  const setFirstBreadcrumbItem = useCallback((item: FirstIndexBreadcrumbItem) => dispatch(setFirstIndexBreadcrumbItem(item)), [dispatch]);
  const addItemBreadcrumb = useCallback((item: BreadcrumbItem) => dispatch(addBreadcrumbItem(item)), [dispatch]);
  const addItemsBreadcrumb = useCallback((item: BreadcrumbItem[]) => dispatch(addBreadcrumbItems(item)), [dispatch]);
  const deleteItems = useCallback((key: BreadcrumbItem["key"]) => dispatch(deleteUnusedBreadcrumbItems(key)), [dispatch]);
  const addWIthIndex = useCallback((data: AddBreadcrumbWithIndex) => dispatch(addBreadcrumbItemWithIndex(data)), [dispatch]);
  const deleteByKey = useCallback((key: BreadcrumbItem["key"]) => dispatch(deleteBreadcrumbItemsByKey(key)), [dispatch]);

  const resetItems = useCallback(() => dispatch(resetBreadcrumb()), [dispatch]);

  return {
    setFirstBreadcrumbItem,
    addItemBreadcrumb,
    addItemsBreadcrumb,
    setStatus,
    deleteItems,
    resetItems,
    addWIthIndex,
    deleteByKey,
  };
};

export default useBreadcrumbSetState;
