import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import { useMapContext } from "@context/app-context";
import {
  COMPLETED,
  SETTING_HIDE_ALL,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import { categoryIdNameMap } from "@data/categoryItemsConfig";
import useLocalStorage from "@hooks/useLocalStorage";
import { categoryHiddenState } from "@lib/getHiddenState";

const NoteMarker = dynamic(() => import("@components/Marker/NoteMarker"), {
  ssr: false,
});

const RMTooltip = dynamic(() => import("@components/Popup/RMTooltip"), {
  ssr: false,
});

const RMPopup = dynamic(() => import("@components/Popup/RMPopup"), {
  ssr: false,
});

const MarkerClusterGroup = dynamic(
  () => import("@components/Marker/MarkerClusterGroup"),
  {
    ssr: false,
  }
);

const PolyLines = dynamic(() => import("@components/Line/PolyLines"), {
  ssr: false,
});

const TextLayer = dynamic(() => import("@components/Layer/TextLayer"), {
  ssr: false,
});

const RMMapContainer = dynamic(() => import("@components/Map/RMMapContainer"), {
  ssr: false,
});

const RMMarker = dynamic(() => import("@components/Marker/RMMarker"), {
  ssr: false,
});

const LayerControl = dynamic(() => import("@components/Control/LayerControl"), {
  ssr: false,
});

const GroupedLayer = dynamic(
  () => import("@components/Control/LayerControl").then((c) => c.GroupedLayer),
  {
    ssr: false,
  }
);

const AppMap = () => {
  const [storageSettings] = useLocalStorage(USER_SETTING, initialUserSettings);
  const { config, markerGroups, clusterGroups, noteMarkers } = useMapContext();
  const [completedMarkers] = useLocalStorage(COMPLETED, {});

  const [userHideComplete, setUserHideComplete] = useState(
    storageSettings[SETTING_HIDE_COMPLETED]
  );
  const [refresh, setRefresh] = useState(false);
  const [hideAll, setHideAll] = useState(storageSettings[SETTING_HIDE_ALL]);

  useEffect(() => {
    if (refresh) {
      const curr = storageSettings[SETTING_HIDE_COMPLETED];
      setUserHideComplete(curr);

      setHideAll(storageSettings[SETTING_HIDE_ALL]);
      setRefresh(false);
    }
  }, [storageSettings, refresh]);

  return (
    <RMMapContainer>
      {(
        { LayerGroup, TileLayer, useMap, Marker, CircleMarker, Tooltip },
        L
      ) => (
        <LayerControl position="topright" setRefresh={setRefresh}>
          <TileLayer
            url={`/tiles/${config.name}/{z}/{x}/{y}.png`}
            noWrap
            bounds={config.bounds}
          />
          {markerGroups.map(
            ({ categoryId, coordinates, ids, ranks, group }, i) => {
              const hidden = categoryHiddenState(categoryId);
              return (
                <GroupedLayer
                  key={`${categoryId} + ${ids[i]}`}
                  checked={!hidden}
                  id={group}
                  name={categoryId}
                  group={group}
                >
                  <LayerGroup>
                    {coordinates.map((coordinate, i) => {
                      const completed = completedMarkers[ids[i]];
                      const hide = (completed && userHideComplete) || hideAll;

                      if (!hide) {
                        return (
                          <RMMarker
                            key={`${ids[i]} ${group}`}
                            opacity={completed ? 0.5 : 1}
                            Marker={Marker}
                            coordinate={coordinate}
                            categoryId={categoryId}
                            markerId={ids[i]}
                            useMap={useMap}
                            rank={ranks[i]}
                          />
                        );
                      }
                    })}
                  </LayerGroup>
                </GroupedLayer>
              );
            }
          )}

          {clusterGroups.length &&
            clusterGroups.map((group) => {
              const { categoryId, group: groupName, coordinates } = group;
              const groupColor =
                "#" +
                (0x1000000 + Math.random() * 0xffffff)
                  .toString(16)
                  .substr(1, 6);

              const hidden = categoryHiddenState(categoryId);

              return (
                <GroupedLayer
                  key={`${categoryId}`}
                  checked
                  id={groupName}
                  name={categoryId}
                  group={groupName}
                >
                  <LayerGroup>
                    <MarkerClusterGroup key={categoryId}>
                      {coordinates.map((coord) => {
                        return (
                          !hidden &&
                          !hideAll && (
                            <CircleMarker
                              key={`${coord[0]} ${coord[1]}`}
                              center={coord}
                              color={groupColor}
                              radius={2}
                            >
                              <RMTooltip>
                                {categoryIdNameMap[categoryId]}
                              </RMTooltip>
                            </CircleMarker>
                          )
                        );
                      })}
                    </MarkerClusterGroup>
                  </LayerGroup>
                </GroupedLayer>
              );
            })}

          {noteMarkers &&
            noteMarkers.map((note) => (
              <NoteMarker key={note[0]} position={note} />
            ))}
          <PolyLines />
          <TextLayer />
        </LayerControl>
      )}
    </RMMapContainer>
  );
};

export default AppMap;
