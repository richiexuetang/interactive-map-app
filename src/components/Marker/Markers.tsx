import React from "react";

import { useMapContext } from "src/context/app-context";
import CustomMarker from "./CustomMarker";
import useLocalStorage from "@hooks/useLocalStorage";
import {
  COMPLETED,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";

const Markers = (props) => {
  const { useMap, useMapEvents } = props;
  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings);
  const [completedMarkers] = useLocalStorage(COMPLETED, {});
  const { standardMarker: markers, config } = useMapContext();

  return (
    <>
      {markers &&
        markers.map((marker, i) => {
          const hide =
            completedMarkers[marker._id] &&
            userSettings[SETTING_HIDE_COMPLETED][config.gameSlug];
          return (
            !hide && (
              <CustomMarker
                key={i}
                useMap={useMap}
                marker={marker}
                rank={i}
                gameSlug={config.gameSlug}
                useMapEvents={useMapEvents}
              />
            )
          );
        })}
    </>
  );
};

export default Markers;
