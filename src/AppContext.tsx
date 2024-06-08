import { createContext, useContext, useState } from "react";
import { Party, Receipt, Tag, Currency, Settlement } from "./Interfaces/interfaces";

const AppContext = createContext<any | undefined>(undefined);

export const AppProdiver = ({ children }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [party, setParty] = useState<Party | undefined>(undefined);
  const [currentMember, setCurrentMember] = useState<string | undefined>(undefined);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [tags, setTags] = useState<Receipt[]>([]);
  const [totalCost, setTotalCost] = useState<Number>(0);
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
      tags,
      setTags,
      totalCost,
      setTotalCost,
      settlements,
      setSettlements
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);