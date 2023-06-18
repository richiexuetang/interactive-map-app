import { MapOrEntries } from "@hooks/useMapObject";
import { createContext, useContext, useState } from "react";

const MapContext = createContext(undefined);

export function MapProvider({ children }) {
  const [config, setConfig] = useState({});
  const [markerRefs, setMarkerRefs] = useState({});
  const [categoryCounts, setCategoryCounts] = useState({});

  const [categoryMap, setCategoryMap] = useState<MapOrEntries<string, string>>(
    []
  );
  const [noteMarkers, setNoteMarkers] = useState([]);

  return (
    <MapContext.Provider
      value={{
        config,
        setConfig,
        markerRefs,
        setMarkerRefs,
        categoryCounts,
        setCategoryCounts,
        categoryMap,
        setCategoryMap,
        noteMarkers,
        setNoteMarkers,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error("useMapContext must be used inside a `MapProvider`");
  }

  return context;
}
