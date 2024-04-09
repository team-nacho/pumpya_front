import { createContext, useContext, useState } from "react";
import { Member } from "./Interfaces/interfaces";

const AppContext = createContext({});

export const AppProdiver = ({ children }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Member>();

  return (
    <AppContext.Provider 
      value={{ 
        loading,
        setLoading, 
        currentUser,
        setCurrentUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};