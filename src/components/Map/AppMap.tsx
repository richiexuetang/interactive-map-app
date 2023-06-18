import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import { useMapContext } from "@context/app-context";
import {
  COMPLETED,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import { categoryIdNameMap } from "@data/categoryItemsConfig";
import useLocalStorage from "@hooks/useLocalStorage";
import { categoryHiddenState } from "@lib/getHiddenState";
import MapListener from "./MapListener";

const NoteMarker = dynamic(() => import("@components/Marker/NoteMarker"), {
  ssr: false,
});

const RMTooltip = dynamic(() => import("@components/Popup/RMTooltip"), {
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

const AppMap = (props) => {
  const { textOverlay, pathMarkers, noteMarkers, markerGroups } = props;
  const [storageSettings] = useLocalStorage(USER_SETTING, initialUserSettings);
  const { config } = useMapContext();
  const [completedMarkers] = useLocalStorage(COMPLETED, {});

  const [userHideComplete, setUserHideComplete] = useState(
    storageSettings[SETTING_HIDE_COMPLETED]
  );
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (refresh) {
      const curr = storageSettings[SETTING_HIDE_COMPLETED];
      setUserHideComplete(curr);
      setRefresh(false);
    }
  }, [storageSettings, refresh]);

  return (
    <RMMapContainer>
      {(
        { LayerGroup, TileLayer, useMap, Marker, CircleMarker, useMapEvents },
        setZoomLevel,
        map
      ) => (
        <>
          {map && (
            <MapListener
              setZoomLevel={setZoomLevel}
              useMapEvents={useMapEvents}
              map={map}
            />
          )}
          <LayerControl position="topright" setRefresh={setRefresh}>
            <TileLayer
              url={`/tiles/${config.name}/{z}/{x}/{y}.png`}
              noWrap
              bounds={config.bounds}
            />
            {markerGroups.map(
              (
                { categoryId, coordinates, ids, ranks, group, markerTypeId },
                i
              ) => {
                const hidden = categoryHiddenState(categoryId);
                const groupColor =
                  "#" +
                  (0x1000000 + Math.random() * 0xffffff)
                    .toString(16)
                    .substr(1, 6);

                return (
                  <GroupedLayer
                    key={`${categoryId} + ${ids[i]}`}
                    checked={!hidden}
                    id={group}
                    name={categoryId}
                    group={group}
                  >
                    <LayerGroup>
                      {markerTypeId === 1 &&
                        coordinates.map((coordinate, i) => {
                          const completed = completedMarkers[ids[i]];
                          const hide =
                            (completed && userHideComplete) || hidden;

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
                      {markerTypeId === 3 && (
                        <MarkerClusterGroup fillColor={groupColor}>
                          <LayerGroup>
                            {coordinates.map((coord) => {
                              return (
                                !hidden && (
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
                          </LayerGroup>
                        </MarkerClusterGroup>
                      )}
                    </LayerGroup>
                  </GroupedLayer>
                );
              }
            )}

            {noteMarkers &&
              noteMarkers.map((note) => (
                <NoteMarker key={note[0]} position={note} />
              ))}
            <PolyLines pathMarkers={pathMarkers} />
            <TextLayer textOverlay={textOverlay} />
          </LayerControl>
        </>
      )}
    </RMMapContainer>
  );
};

export default AppMap;
