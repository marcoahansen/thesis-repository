import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export function useTheses() {
  return useQuery({
    queryKey: ["theses"],
    queryFn: async () => {
      const response = await api.get("/theses");
      return response.data;
    },
  });
}
