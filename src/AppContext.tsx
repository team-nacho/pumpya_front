import { createContext, useContext, useState } from "react";
import { Party, Receipt, Tag, Currency, Settlement } from "./Interfaces/interfaces";

const AppContext = createContext<any | undefined>(undefined);

export const AppProdiver = ({ children }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [party, setParty] = useState<Party | undefined>(undefined);
  const [currentMember, setCurrentMember] = useState<string | undefined>(undefined);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [totalCostsByCurrency, setTotalCostsByCurrency] = useState<{ [key: string]: number }>({});
  const [settlements, setSettlements] = useState<any>([]);
  
  return (
    <AppContext.Provider value={{
      loading,
      setLoading,
      party,
      setParty,
      currentMember,
      setCurrentMember,
      receipts,
      setReceipts,
      totalCostsByCurrency,
      setTotalCostsByCurrency,
      settlements,
      setSettlements
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);