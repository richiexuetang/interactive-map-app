import React, { useState } from "react";
import { Tooltip, CircleMarker } from "react-leaflet";
import useLocalStorageState from "use-local-storage-state";

import { useMapContext } from "@context/app-context";
import MarkerClusterGroup from "@components/Marker/MarkerClusterGroup";
import { categoryIdNameMap } from "@data/categoryItemsConfig";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { SETTING_HIDDEN_CATEGORY, USER_SETTING, initialUserSettings } from "@data/LocalStorage";

const ClusterLayer = () => {
  const [storageSettings] = useLocalStorageState(
    USER_SETTING,
    {defaultValue: initialUserSettings}
  );
  const {clusterGroups} = useMapContext();

  return (
    <>
      {clusterGroups.length && clusterGroups.map((group) => {
        const hidden = storageSettings[SETTING_HIDDEN_CATEGORY][group.categoryId];
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
