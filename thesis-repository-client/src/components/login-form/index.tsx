import { inputError } from "@/helpers/input-error";
import { useLogin } from "@/hooks/user-hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import faeterj from "../../assets/faeterj.png";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

const loginSchema = z.object({
  email: z
    .string()
    .email("Por favor, insira um email válido")
    .min(1, 'O campo "email" não pode ser vazio'),
  password: z
    .string()
    .min(6, 'O campo "senha" deve ter no mínimo 6 caracteres'),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { mutate } = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginSchema) {
    mutate(data, {
      onSuccess: () => {
        toast.success("Login realizado com sucesso");
        navigate("/admin");
      },
      onError: (error) => {
        toast.error("Erro ao realizar login");
        console.error(error);
      },
    });
  }

  return (
    <form className="w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="w-full gap-4 flex flex-col items-center justify-center">
            <img className="w-20" src={faeterj} alt="logo-faeterj" />
            <CardTitle className="text-sky-900">
              Entre com a sua conta
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="email@faeterj-petropolis.edu.br"
              error={inputError(errors, "email")}
              {...register("email")}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              error={inputError(errors, "password")}
              placeholder="****"
              {...register("password")}
            />
          </div>
        </CardContent>
        <CardFooter className="grid place-items-end">
          <Button type="submit" className="w-64">
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
