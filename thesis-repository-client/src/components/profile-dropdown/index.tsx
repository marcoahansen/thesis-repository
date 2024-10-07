import { useLogout, useUserData } from "@/hooks/user-hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export function ProfileDropdown({
  align = "start",
  hidden = "",
}: {
  align?: "start" | "end";
  hidden?: string;
}) {
  const { data: user, isLoading } = useUserData();
  const { mutate } = useLogout();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogout() {
    mutate(undefined, {
      onSuccess: () => {
        toast.success("Logout realizado com sucesso");
        queryClient.removeQueries({ queryKey: ["user"] });
        navigate("/signin");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  }

  if (isLoading) return null;
  const userInitial = user?.name && user?.name.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`overflow-hidden rounded-full ${hidden}`}
        >
          <Avatar>
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuLabel>Olá, {user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
