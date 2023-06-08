import { initialUserSettings } from "@data/LocalStorage";
import { createContext, useContext, useState } from "react";

const MapContext = createContext(undefined);

export function MapProvider({ children }) {
  const [config, setConfig] = useState({});
  const [categoryItems, setCategoryItems] = useState({});
  const [markerRefs, setMarkerRefs] = useState({});
  const [categoryCounts, setCategoryCounts] = useState({});

  const [textOverlay, setTextOverlay] = useState([]);
  const [clusterGroups, setClusterGroups] = useState([]);
  const [pathMarkers, setPathMarkers] = useState([]);
  const [markerGroups, setMarkerGroups] = useState([]);
  const [userSettings, setUserSettings] = useState(initialUserSettings);

  return (
    <MapContext.Provider
      value={{
        config,
        setConfig,
        categoryItems,
        setCategoryItems,
        markerRefs,
        setMarkerRefs,
        categoryCounts,
        setCategoryCounts,
        textOverlay,
        setTextOverlay,
        setClusterGroups,
        clusterGroups,
        pathMarkers,
        setPathMarkers,
        markerGroups,
        setMarkerGroups,
        userSettings, setUserSettings
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
