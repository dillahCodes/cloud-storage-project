import { AuthState } from "@/features/auth/auth";
import useUser from "@/features/auth/hooks/use-user";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRouter = () => {
  const [statusHistory, setStatusHistory] = useState<AuthState["status"][]>(["idle"]);
  const navigate = useNavigate();
  const { user, status } = useUser();

  const isNotUser = useMemo(() => {
    const [firstStatus, secondStatus] = statusHistory;
    return firstStatus === "idle" && secondStatus === "idle" && !user;
  }, [statusHistory, user]);

  const isUserLogOut = useMemo(() => {
    const [firstStatus, secondStatus] = statusHistory;
    const lastStatus = statusHistory[statusHistory.length - 1];
    return firstStatus === "idle" && secondStatus === "succeeded" && lastStatus === "idle" && !user;
  }, [statusHistory, user]);

  const isUser = useMemo(() => {
    const [firstStatus, secondStatus] = statusHistory;
    return firstStatus === "idle" && secondStatus === "succeeded" && user;
  }, [statusHistory, user]);

  useEffect(() => {
    setStatusHistory((prev) => [...prev, status]);
  }, [status]);

  useEffect(() => {
    if (isNotUser || isUserLogOut) navigate("/login");
  }, [isNotUser, isUserLogOut, navigate]);

  return isUser ? <Outlet /> : null;
};

export default ProtectedRouter;
