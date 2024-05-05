import React from "react";
import { useStorageState } from "../hooks/use-storage-state";

interface AuthContextType {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useSession(): AuthContextType {
  const value = React.useContext(AuthContext);
  if (value === undefined) {
    throw new Error("useSession must be used within a WalletProvider");
  }

  return value;
}

export function WalletProvider({ children }: React.PropsWithChildren<{}>) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const signIn = async () => {
    try {
      // Simulate API call or authentication logic
      const newSessionToken = "newSessionToken"; // Replace with actual sign-in logic
      setSession(newSessionToken);
    } catch (error) {
      console.error("Failed to sign in:", error);
      throw new Error("Failed to sign in. Please try again later."); // Optionally rethrow or handle error
    }
  };

  const signOut = async () => {
    try {
      // Additional cleanup logic before signing out if necessary
      setSession(null);
    } catch (error) {
      console.error("Failed to sign out:", error);
      throw new Error("Failed to sign out. Please try again later."); // Optionally rethrow or handle error
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
