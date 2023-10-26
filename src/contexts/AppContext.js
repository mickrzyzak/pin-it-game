import { createContext, useContext } from "react";

const AppContext = createContext();

function AppProvider({ value, children }) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useApp() {
  return useContext(AppContext);
}

export { AppProvider, useApp };
