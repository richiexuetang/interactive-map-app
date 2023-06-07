import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { MapPopup } from "@components/Popup";
import {
  initialUserSettings,
  COMPLETED,
  USER_SETTING,
  SETTING_HIDE_COMPLETED,
  SETTING_HIDDEN_CATEGORY,
} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";
import { useMapContext } from "@context/app-context";
import styled from "styled-components";

const Marker = dynamic(() => import("./DynamicMarker"), {
  ssr: false,
});

const CustomMarker = (props) => {
  const params = useSearchParams();
  const markerSearchParam = params.get("markerId");

  const { marker, useMap, rank } = props;
  const { config } = useMapContext();
  const { id, categoryId, markerName, coordinate, descriptions } = marker;

  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings);
  const [hideCompleted] = useState(
    userSettings[SETTING_HIDE_COMPLETED][config.gameSlug]
  );
  const [completedMarkers] = useLocalStorage(COMPLETED, {});

  const [completed, setCompleted] = useState(completedMarkers[id]);

  const shouldHideCompleted = hideCompleted && completedMarkers[id];
  const shouldHideCategory = userSettings[SETTING_HIDDEN_CATEGORY][categoryId];

  const [hidden, setHidden] = useState(
    shouldHideCategory || shouldHideCompleted
  );

  const map = useMap();

  useEffect(() => {
    if (markerSearchParam && markerSearchParam === id) {
      map.flyTo(coordinate, map.getMaxZoom(), {
        animate: true,
        duration: 0.5,
      });
    }
  }, [markerSearchParam]);

  useEffect(() => {
    if (
      (completedMarkers[id] &&
        userSettings[SETTING_HIDE_COMPLETED][config.gameSlug]) ||
      userSettings[SETTING_HIDDEN_CATEGORY][categoryId]
    ) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [completedMarkers, userSettings]);
  return (
    <>
      {!hidden && (
        <Marker
          opacity={completed ? 0.5 : 1}
          marker={marker}
          useMap={useMap}
          rank={rank}
        >
          {({ Popup, Tooltip }) => {
            return (
              <>
                <MapPopup
                  markerInfo={{
                    title: markerName,
                    id: id,
                    category: categoryId,
                    descriptions: descriptions,
                  }}
                />
              </>
            );
          }}
        </Marker>
      )}
    </>
  );
};

export default CustomMarker;
