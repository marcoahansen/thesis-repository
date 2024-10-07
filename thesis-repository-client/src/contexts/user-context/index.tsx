import { createContext, useContext, useState } from "react";

export interface User {
  email: string;
  id: string;
  name: string;
}

type Token = string;

interface UserContextProps {
  user: User | null;
  token: Token | null;
  setUser: (user: User | null) => void;
  setToken: (token: Token | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<Token | null>(null);

  return (
    <UserContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
