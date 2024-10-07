import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/users");
      return response.data;
    },
  });
}
