import { createContext, useContext, useState } from "react";

const AppContext = createContext({});

export const AppProdiver = ({ children }: any) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};