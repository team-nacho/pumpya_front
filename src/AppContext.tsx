import { createContext, useContext, useState } from "react";
import { Member, Party } from "./Interfaces/interfaces";

interface AppContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser?: Member;
  setCurrentUser: React.Dispatch<React.SetStateAction<Member | undefined>>;
  party: Party | null;
  setParty: React.Dispatch<React.SetStateAction<Party | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProdiver = ({ children }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Member>();
  const [party, setParty] = useState<Party | null>(null);

  return (
    <AppContext.Provider 
      value={{ 
        loading,
        setLoading, 
        currentUser,
        setCurrentUser,
        party,
        setParty
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);