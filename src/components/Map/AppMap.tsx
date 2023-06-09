import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import { useMapContext } from "@context/app-context";
import {
  COMPLETED,
  SETTING_HIDDEN_CATEGORY,
  SETTING_HIDDE_ALL,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import {
  categoryIdNameMap,
  categoryItemsConfig,
} from "@data/categoryItemsConfig";
import useLocalStorage from "@hooks/useLocalStorage";

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
  const { config, markerGroups, clusterGroups } = useMapContext();
  const [completedMarkers, setCompletedMarkers] = useLocalStorage(
    COMPLETED,
    {}
  );
  
  const [userHideComplete, setUserHideComplete] = useState(
    storageSettings[SETTING_HIDE_COMPLETED][config.game]
  );
  const [refresh, setRefresh] = useState(false);
  const [hideAll, setHideAll] = useState(storageSettings[SETTING_HIDDE_ALL]);

  useEffect(() => {
    if (refresh) {
      const curr = storageSettings.hideCompletedMarkers[config.game];
      setUserHideComplete(curr);

      setHideAll(storageSettings[SETTING_HIDDE_ALL]);
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
              const categoryHiddenState = storageSettings[SETTING_HIDDEN_CATEGORY][categoryId];
              if (!hideAll) {
                return (
                  <GroupedLayer
                    key={`${categoryId} + ${ids[i]}`}
                    checked={!categoryHiddenState}
                    id={group}
                    name={categoryId}
                    group={group}
                  >
                    <LayerGroup>
                      {coordinates.map((coordinate, i) => {
                        const completed = completedMarkers[ids[i]];
                        const hide = completed && userHideComplete;

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
            }
          )}

          {clusterGroups.length &&
            clusterGroups.map((group) => {
              let groupName = "locations";
              categoryItemsConfig.map((item) => {
                if (item.gameSlug === config.gameSlug) {
                  item.categoryGroups.map(({ members, name }) => {
                    if (members.includes(group.categoryId)) {
                      groupName = name;
                    }
                  });
                }
              });

              const groupColor =
                "#" +
                (0x1000000 + Math.random() * 0xffffff)
                  .toString(16)
                  .substr(1, 6);

              const hidden =
              storageSettings[SETTING_HIDDEN_CATEGORY][group.categoryId];

              if (!hideAll && !hidden) {
                return (
                  <GroupedLayer
                    key={`${group.categoryId}`}
                    checked
                    id={groupName}
                    name={group.categoryId}
                    group={groupName}
                  >
                    <LayerGroup>
                      <MarkerClusterGroup key={group.categoryId}>
                        {group.coordinates.map((coord) => {
                          return (
                            <CircleMarker
                              center={coord}
                              color={groupColor}
                              radius={2}
                            >
                              <Tooltip>
                                {categoryIdNameMap[group.categoryId]}
                              </Tooltip>
                            </CircleMarker>
                          );
                        })}
                      </MarkerClusterGroup>
                    </LayerGroup>
                  </GroupedLayer>
                );
              }
            })}
          <PolyLines />
          <TextLayer />
        </LayerControl>
      )}
    </RMMapContainer>
  );
};

export default AppMap;
