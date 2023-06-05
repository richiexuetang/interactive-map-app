import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import styled from "@emotion/styled";

import { MapPopup } from "@components/Popup";
import {
  initialUserSettings,
  COMPLETED,
  USER_SETTING,
  SETTING_HIDE_COMPLETED,
  SETTING_HIDDEN_CATEGORY,
} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";

const Marker = dynamic(() => import("./DynamicMarker"), {
  ssr: false,
});

const CustomMarker = (props) => {
  const params = useSearchParams();
  const markerSearchParam = params.get("markerId");

  const { marker, useMap, rank, gameSlug, useMapEvents } = props;
  const { _id: id, category, title, coord } = marker;

  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings);
  const [hideCompleted] = useState(
    userSettings[SETTING_HIDE_COMPLETED][gameSlug]
  );
  const [completedMarkers] = useLocalStorage(COMPLETED, {});

  const [completed, setCompleted] = useState(completedMarkers[id]);

  const shouldHideCompleted = hideCompleted && completedMarkers[id];
  const shouldHideCategory =
    userSettings[SETTING_HIDDEN_CATEGORY][gameSlug][category];

  const [hidden, setHidden] = useState(
    shouldHideCategory || shouldHideCompleted
  );

  const map = useMap();

  useEffect(() => {
    if (markerSearchParam && markerSearchParam === id) {
      map.flyTo(coord, map.getMaxZoom(), {
        animate: true,
        duration: 0.5,
      });
    }
  }, [markerSearchParam]);

  useEffect(() => {
    if (
      (completedMarkers[id] &&
        userSettings[SETTING_HIDE_COMPLETED][gameSlug]) ||
      userSettings[SETTING_HIDDEN_CATEGORY][gameSlug][category]
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
          {({ Popup, Tooltip }, fetchInfo) => {
            const CustomTooltip = styled(Tooltip)`
              margin-left: 15px;

              background: #221c0f;
              border: 1px solid #584835;
              color: #af894d;
              overflow: hidden;

              > p {
                margin-right: 10px;
                margin-bottom: 10px;
                margin-top: 15px !important;
              }
            `;

            const CustomPopup = styled(Popup)`
              border-radius: 0;
              white-space: nowrap;
              min-width: 450px;
              white-space: initial;
              bottom: 35px !important;
              

              .leaflet-popup-content {
                max-height: 300px;
                width: auto !important;
                overflow-y: scroll;
                p {
                  margin: 0 !important;
                  line-height: 1.5em;
                }
              }
              .leaflet-popup-content-wrapper {
                border-radius: 0;
                background: #221c0f;
                border: 0.2px solid #fbe4bd;
                color: #967959;
                overflow-wrap: hidden;
              }

              .leaflet-popup-content-wrapper::after {
                content: "";
                position: absolute;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: black transparent transparent transparent;
              }

              .leaflet-popup-tip {
                background: #221c0f;
              }

              .leaflet-popup-tip-container {
                background: transparent;
              }

              .leaflet-popup-close-button {
                right: 5px !important;
                top: 3px !important;
              }
            `;

            if(fetchInfo) {
              return (
                <>
                  <MapPopup
                    Popup={CustomPopup}
                    markerInfo={{
                      title: title,
                      id: id,
                      category: category,
                    }}
                    setCompleted={setCompleted}
                    fetchInfo={fetchInfo}
                  />
                  <CustomTooltip>{title}</CustomTooltip>
                </>
              );
            }
            
          }}
        </Marker>
      )}
    </>
  );
};

export default CustomMarker;
