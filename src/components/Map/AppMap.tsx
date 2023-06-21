import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";

import { useMapContext } from "@context/app-context";
import {
  COMPLETION_TRACK,
  SETTING_HIDDEN_CATEGORY,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import { categoryIdNameMap } from "@data/categoryItemsConfig";
import { categoryHiddenState } from "@lib/getHiddenState";
import { getTarget } from "@lib/getTargetProperty";

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
  const { textOverlay, pathMarkers, markerGroups } = props;
  const [storageSettings] = useLocalStorageState(USER_SETTING, {
    defaultValue: initialUserSettings,
  });
  const { config, noteMarkers } = useMapContext();

  const [userHideComplete, setUserHideComplete] = useState(
    storageSettings[SETTING_HIDE_COMPLETED]
  );
  const [searchState, setSearchState] = useState("IDLE");
  const [results, setResults] = useState([]); //search
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const [completionTrack, setCompletionTrack] = useLocalStorageState(
    COMPLETION_TRACK,
    { defaultValue: { [config.name]: { completed: {}, category: {} } } }
  );

  useEffect(() => {
    if (config.name && !completionTrack[config.name]) {
      setCompletionTrack({
        ...completionTrack,
        [config.name]: { completed: {}, category: {} },
      });
    }
  }, [config]);

  useEffect(() => {
    if (refresh) {
      const curr = storageSettings[SETTING_HIDE_COMPLETED];
      setUserHideComplete(curr);
      setRefresh(false);
    }
  }, [storageSettings, refresh]);

  useEffect(() => {
    if (!config.name) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [config.name]);

  if (loading) {
    return null;
  }

  return (
    <RMMapContainer>
      {({ LayerGroup, TileLayer, useMap, Marker, CircleMarker }) => (
        <>
          <LayerControl
            setRefresh={setRefresh}
            searchState={searchState}
            setSearchState={setSearchState}
            results={results}
            setResults={setResults}
          >
            <TileLayer
              url={`/tiles/${config.name}/{z}/{x}/{y}.png`}
              noWrap
              bounds={config.bounds}
            />
            {searchState === "COMPLETE" && (
              <>
                {results.map((result, i) => {
                  const { _id: id, coordinate, categoryId } = result;
                  const completed = getTarget(completionTrack, [config.name, "completed", id]);

                  return (
                    <RMMarker
                      key={`${id}`}
                      opacity={completed ? 0.5 : 1}
                      Marker={Marker}
                      coordinate={coordinate}
                      categoryId={categoryId}
                      markerId={id}
                      useMap={useMap}
                      rank={i}
                    />
                  );
                })}
              </>
            )}

            {markerGroups.map(
              (
                { categoryId, coordinates, ids, ranks, group, markerTypeId },
                i
              ) => {
                const hidden = getTarget(storageSettings, [SETTING_HIDDEN_CATEGORY, categoryId]);
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
                          const mapCompleteInfo = completionTrack[config.name];
                          const completed = mapCompleteInfo?.completed[ids[i]];
                          const hide =
                            (completed && userHideComplete) || hidden;

                          if (!hide && searchState !== "COMPLETE") {
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
          </LayerControl>
          {searchState !== "COMPLETE" && (
            <>
              <TextLayer textOverlay={textOverlay} />

              <PolyLines pathMarkers={pathMarkers} />
            </>
          )}

          {noteMarkers &&
            noteMarkers.map((note) => (
              <NoteMarker key={note[0]} position={note} />
            ))}
        </>
      )}
    </RMMapContainer>
  );
};

export default AppMap;
