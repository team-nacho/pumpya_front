import { createContext, useContext, useState } from "react";
import { Party, Receipt, ExchangeRate } from "./Interfaces/interfaces";

const AppContext = createContext<any | undefined>(undefined);

export const AppProdiver = ({ children }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [party, setParty] = useState<Party | undefined>(undefined);
  const [currentMember, setCurrentMember] = useState<string | undefined>(
    undefined
  );
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [totalCostsByCurrency, setTotalCostsByCurrency] = useState<{ [key: string]: number }>({});
  
  
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
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
