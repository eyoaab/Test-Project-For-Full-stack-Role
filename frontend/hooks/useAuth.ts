import { useSession } from "next-auth/react";
import { SessionUser } from "@/types";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user as SessionUser | undefined,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isManager: session?.user?.role === "manager",
    isUser: session?.user?.role === "user",
    token: session?.user?.token,
  };
}
