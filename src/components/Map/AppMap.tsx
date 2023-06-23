import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";

import { useMapContext } from "@context/app-context";
import {categoryIdNameMap,
  initialUserSettings} from '@data/.'
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
  const { textOverlay, pathMarkers, locations, locationGroups } = props;

  const [storageSettings] = useLocalStorageState("interactive_map_user_setting", {
    defaultValue: initialUserSettings,
  });
  const { config, noteMarkers } = useMapContext();

  const [userHideComplete, setUserHideComplete] = useState(
    storageSettings["hideCompletedMarkers"]
  );
  const [searchState, setSearchState] = useState("IDLE");
  const [results, setResults] = useState([]); //search
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const [completionTrack, setCompletionTrack] = useLocalStorageState(
    "rm.completion_track",
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
      const curr = storageSettings["hideCompletedMarkers"];
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
                  const { _id: id } = result;
                  const completed = getTarget(completionTrack, [
                    config.name,
                    "completed",
                    id,
                  ]);
                  const data = locations.find((item) => item._id === id);

                  return (
                    <RMMarker
                      key={`${id}`}
                      opacity={completed ? 0.5 : 1}
                      Marker={Marker}
                      useMap={useMap}
                      rank={i}
                      data={data}
                    />
                  );
                })}
              </>
            )}

            {locationGroups.map(
              ({ categoryId, ranks, group, markerTypeId }, i) => {
                const hidden = getTarget(storageSettings, [
                  "hiddenCategories",
                  categoryId,
                ]);
                const groupColor =
                  "#" +
                  (0x1000000 + Math.random() * 0xffffff)
                    .toString(16)
                    .substr(1, 6);
                return (
                  <GroupedLayer
                    key={`${categoryId} + ${group}`}
                    checked={!hidden}
                    id={group}
                    name={categoryId}
                    group={group}
                  >
                    <LayerGroup>
                      {markerTypeId === 1 &&
                        ranks.map((rank, i) => {
                          const location = locations[rank];
                          const mapCompleteInfo = completionTrack[config.name];
                          const completed =
                            mapCompleteInfo?.completed[location._id];
                          const hide =
                            (completed && userHideComplete) || hidden;
                          if (
                            !hide &&
                            searchState !== "COMPLETE" &&
                            location?.coordinate
                          ) {
                            return (
                              <RMMarker
                                key={`${location._id} ${group}`}
                                opacity={completed ? 0.5 : 1}
                                Marker={Marker}
                                useMap={useMap}
                                rank={rank}
                                data={location}
                              />
                            );
                          }
                        })}
                      {markerTypeId === 3 && (
                        <MarkerClusterGroup fillColor={groupColor}>
                          <LayerGroup>
                            {ranks.map((rank, i) => {
                              const location = locations[rank];
                              return (
                                !hidden && (
                                  <CircleMarker
                                    key={`${rank}`}
                                    center={location.coordinate}
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
