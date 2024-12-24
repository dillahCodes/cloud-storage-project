import { useEffect } from "react";
import useBreadcrumbSetState from "./use-breadcrumb-setstate";
import useBreadcrumbState from "./use-breadcrumb-state";

interface UseResetAllBreadcrumbItems {
  addFirstBreadcrumbItem?: FirstIndexBreadcrumbItem;
  shouldReset: boolean;
}
const useResetAllBreadcrumbItems = ({ addFirstBreadcrumbItem, shouldReset }: UseResetAllBreadcrumbItems) => {
  const { resetItems, setFirstBreadcrumbItem } = useBreadcrumbSetState();
  const breadcrumbState = useBreadcrumbState();

  useEffect(() => {
    if (!shouldReset) return;
    resetItems();
  }, [resetItems, shouldReset]);

  useEffect(() => {
    if (breadcrumbState.items.length !== 0 || !addFirstBreadcrumbItem) return;
    setFirstBreadcrumbItem(addFirstBreadcrumbItem);
  }, [addFirstBreadcrumbItem, breadcrumbState.items.length, setFirstBreadcrumbItem]);
};
export default useResetAllBreadcrumbItems;
