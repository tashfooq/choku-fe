import { createContext, ReactNode, useState } from "react";

export type AuthContextType = {
  token: string;
  setToken: (token: string) => void;
};

export type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState("");
  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
