import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export type AuthContextType = {
  isLoggedIn: boolean;
  // setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const isLoggedIn = localStorage.getItem("accessToken") !== null;
  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
