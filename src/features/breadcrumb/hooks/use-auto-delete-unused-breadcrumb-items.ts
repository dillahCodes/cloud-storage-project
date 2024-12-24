import { useEffect } from "react";
import useBreadcrumbSetState from "./use-breadcrumb-setstate";

interface UseAutoDeleteUnusedBreadcrumbItemsProps {
  breadcrumbKey: BreadcrumbItem["key"];
  shouldDelete: boolean;
}
const useAutoDeleteUnusedBreadcrumbItems = ({
  breadcrumbKey,
  shouldDelete,
}: UseAutoDeleteUnusedBreadcrumbItemsProps) => {
  const { deleteItems } = useBreadcrumbSetState();

  useEffect(() => {
    if (!shouldDelete || !breadcrumbKey) return;
    deleteItems(breadcrumbKey);
  }, [breadcrumbKey, shouldDelete, deleteItems]);
};

export default useAutoDeleteUnusedBreadcrumbItems;
