import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import styled from "@emotion/styled";

import { MapPopup } from "@components/Popup";
import { useMarkerContext } from "@context/marker-context";
import {
  initialUserSettings,
  COMPLETED,
  SETTING_HIDDEN_CATEGORY,
  USER_SETTING,
} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";
import { useMapContext } from "@context/app-context";

const Marker = dynamic(() => import("./DynamicMarker"), {
  ssr: false,
});

const CustomMarker = (props) => {
  const params = useSearchParams();
  const markerSearchParam = params.get("markerId");

  const { marker, useMap, rank, gameSlug } = props;
  const { _id: id, category, title, type, descriptions, coord } = marker;

  const { hideCompleted, setHiddenCategories, hiddenCategories } =
    useMarkerContext();
  const { markerRefs } = useMapContext();
  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings);

  const completedMarkers =
    JSON.parse(window.localStorage.getItem(COMPLETED)) || {};
  const [completed, setCompleted] = useState(completedMarkers[id]);

  const shouldHideCompleted = hideCompleted && completedMarkers[id];
  const shouldHideCategory = hiddenCategories[category];

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
      userSettings &&
      userSettings[SETTING_HIDDEN_CATEGORY][gameSlug][category]
    ) {
      const currentHidden = userSettings[SETTING_HIDDEN_CATEGORY][gameSlug];
      const targetCategory = currentHidden[category];
      setHiddenCategories({ ...currentHidden, [targetCategory]: true });
    } else {
      const currentHidden = userSettings[SETTING_HIDDEN_CATEGORY][gameSlug];
      const targetCategory = currentHidden[category];
      setHiddenCategories({ ...currentHidden, [targetCategory]: false });
    }
  }, [setHiddenCategories]);

  return (
    <>
      {!shouldHideCategory && !shouldHideCompleted && (
        <Marker
          opacity={completed ? 0.5 : 1}
          gameSlug={gameSlug}
          marker={marker}
          useMap={useMap}
          rank={rank}
        >
          {({ Popup, Tooltip }) => {
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
              min-width: 350px;
              max-width: 450px;
              white-space: initial;
              bottom: 15px !important;

              .leaflet-popup-content {
                p {
                  margin-top: 0 !important;
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
            `;

            return (
              <>
                <MapPopup
                  Popup={CustomPopup}
                  title={title}
                  type={type}
                  descriptions={descriptions}
                  id={id}
                  setCompleted={setCompleted}
                  completed={completed}
                />
                <CustomTooltip>{title}</CustomTooltip>
              </>
            );
          }}
        </Marker>
      )}
    </>
  );
};

export default CustomMarker;
