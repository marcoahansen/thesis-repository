import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/user-context";
import { api } from "@/api/axios";

export function useLogin() {
  const { setUser } = useUser();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await api.post("/users/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
}

export function useLogout() {
  const { setUser } = useUser();
  return useMutation({
    mutationFn: async () => {
      await api.delete("/users/logout");
    },
    onSuccess: () => {
      setUser(null);
    },
  });
}

export function useUserData() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (user) return user;
      const response = await api.get("/users/me");
      return response.data;
    },
    retry: 1,
  });
}
