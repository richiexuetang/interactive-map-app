import React from "react";
import { Tooltip, CircleMarker } from "react-leaflet";
import useLocalStorageState from "use-local-storage-state";

import { useMapContext } from "@context/app-context";
import MarkerClusterGroup from "@components/Marker/MarkerClusterGroup";
import { categoryIdNameMap } from "@data/config/categoryItemsConfig";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { initialUserSettings } from "@data/LocalStorage";

const ClusterLayer = () => {
  const [storageSettings] = useLocalStorageState(
    "interactive_map_user_setting",
    {defaultValue: initialUserSettings}
  );
  const {clusterGroups} = useMapContext();

  return (
    <>
      {clusterGroups.length && clusterGroups.map((group) => {
        const hidden = storageSettings["hiddenCategories"][group.categoryId];
        if (!hidden) {
          return (
            <MarkerClusterGroup key={group.categoryId}>
              {group.coordinates.map((coord) => (
                <CircleMarker center={coord} fillColor="blue" radius={2}>
                  <Tooltip>{categoryIdNameMap[group.categoryId]}</Tooltip>
                </CircleMarker>
              ))}
            </MarkerClusterGroup>
          );
        }
      })}
    </>
  );
};

export default ClusterLayer;
