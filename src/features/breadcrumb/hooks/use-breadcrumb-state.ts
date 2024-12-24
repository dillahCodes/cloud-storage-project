import { useSelector } from "react-redux";
import { breadcrumbSelector } from "../slice/breadcrumb-slice";

const useBreadcrumbState = () => {
  const breadcrumbState = useSelector(breadcrumbSelector);
  return breadcrumbState;
};
export default useBreadcrumbState;
