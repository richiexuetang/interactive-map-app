import { createContext, useContext, useState } from "react";

const MarkerContext = createContext(undefined);

export function MarkerProvider({ children }) {
  const [hideCompleted, setHideCompleted] = useState(null);
  const [hiddenCategories, setHiddenCategories] = useState({});

  return (
    <MarkerContext.Provider
      value={{
        hideCompleted,
        setHideCompleted,
        hiddenCategories,
        setHiddenCategories,
      }}
    >
      {children}
    </MarkerContext.Provider>
  );
}

export function useMarkerContext() {
  const context = useContext(MarkerContext);

  if (!context) {
    throw new Error("useMarkerContext must be used inside a `MarkerProvider`");
  }

  return context;
}
