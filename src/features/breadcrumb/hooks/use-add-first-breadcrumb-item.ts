import { useEffect } from "react";
import useBreadcrumbSetState from "./use-breadcrumb-setstate";

interface UseAddFirstBreadcrumbItem {
  breadcrumbItem: FirstIndexBreadcrumbItem;
  addInMount: boolean;
}
const useAddFirstBreadcrumbItem = ({ breadcrumbItem, addInMount }: UseAddFirstBreadcrumbItem) => {
  const { setFirstBreadcrumbItem } = useBreadcrumbSetState();

  useEffect(() => {
    if (!breadcrumbItem || !addInMount) return;
    setFirstBreadcrumbItem(breadcrumbItem);
  }, [addInMount, breadcrumbItem, setFirstBreadcrumbItem]);
};

export default useAddFirstBreadcrumbItem;
