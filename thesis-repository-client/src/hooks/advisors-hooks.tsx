import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export function useAdvisors() {
  return useQuery({
    queryKey: ["advisors"],
    queryFn: async () => {
      const response = await api.get("/advisors");
      return response.data;
    },
  });
}
