import { createContext, useContext, useState } from "react";

const MapContext = createContext(undefined);

export function MapProvider({ children }) {
  const [area, setArea] = useState(null);
  const [markers, setMarkers] = useState({});
  const [config, setConfig] = useState({});
  const [categoryItems, setCategoryItems] = useState({});
  const [categoryCounts, setCategoryCounts] = useState({});
  const [game, setGame] = useState(null);

  return (
    <MapContext.Provider
      value={{
        area,
        setArea,
        markers,
        setMarkers,
        config,
        setConfig,
        categoryItems,
        setCategoryItems,
        categoryCounts,
        setCategoryCounts,
        game, 
        setGame
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
    const context = useContext(MapContext);

    if (!context) {
        throw new Error('useMapContext must be used inside a `MapProvider`')
    }

    return context;
}
