import { useEffect } from "react";
import useBreadcrumbSetState from "./use-breadcrumb-setstate";

interface UseAddBreadcrumbItems {
  breadcrumbItems: BreadcrumbItem[];
  status: BreadcrumbItemFetchStatus;
}
const useAddBreadcrumbItems = ({ breadcrumbItems, status }: UseAddBreadcrumbItems) => {
  const { addItemsBreadcrumb, setStatus } = useBreadcrumbSetState();

  useEffect(() => {
    setStatus(status);
  }, [status, setStatus]);

  useEffect(() => {
    addItemsBreadcrumb(breadcrumbItems);
  }, [breadcrumbItems, addItemsBreadcrumb]);
};

export default useAddBreadcrumbItems;
