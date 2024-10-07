// PublicRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserData } from "@/hooks/user-hooks";
import { toast } from "sonner";
import Loading from "@/components/loading";

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { data: user, isLoading } = useUserData();

  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    toast.success("Você já está logado!");
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
