import { Navigate } from "react-router-dom";
import { useUserData } from "@/hooks/user-hooks";
import Loading from "@/components/loading";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { data: user, isLoading } = useUserData();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
}
