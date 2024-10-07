import { LoginForm } from "@/components/login-form";
import { Info } from "lucide-react";

export function SignIn() {
  return (
    <main className="h-screen bg-gradient-to-tr from-sky-900 to-blue-500 flex flex-col items-center justify-center w-full p-4">
      <LoginForm />
      <a
        target="blank"
        className="text-zinc-500 text-center text-xs mt-2"
        href="https://faeterj-petropolis.edu.br/"
      >
        <div className="flex gap-1 items-center text-zinc-100">
          <Info className="w-4 h-4" />
          Faeterj Petrópolis - 2024 - Todos os direitos reservados
        </div>
      </a>
    </main>
  );
}
