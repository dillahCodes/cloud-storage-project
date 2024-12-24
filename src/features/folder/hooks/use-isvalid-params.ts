import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface useIsValidParamsProps {
  removeSearchParams?: boolean;
}
const useIsValidParams = ({ removeSearchParams }: useIsValidParamsProps = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [paramsState] = useState<NestedBreadcrumbType>((searchParams.get("st") as NestedBreadcrumbType) || "");
  const isMystoragePage = paramsState === "my-storage";

  const isValidSearchParams = ["my-storage", "shared-with-me"].includes(paramsState);

  useEffect(() => {
    if (removeSearchParams && isMystoragePage) setSearchParams({});
  }, [removeSearchParams, isMystoragePage, setSearchParams]);

  return { isValidSearchParams };
};

export default useIsValidParams;
