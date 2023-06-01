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
  const { useMap } = props;
  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings);
  const [completedMarkers] = useLocalStorage(COMPLETED, {});
  const { markers, game: gameSlug, canvasCategories } = useMapContext();

  return (
    <>
      {markers &&
        markers.map((marker, i) => {
          // const inCanvas = canvasCategories.includes(marker.category);
          const hide =
            completedMarkers[marker._id] &&
            userSettings[SETTING_HIDE_COMPLETED][gameSlug];
          return (
            !hide && (
              <CustomMarker
                key={i}
                useMap={useMap}
                marker={marker}
                rank={i}
                gameSlug={gameSlug}
              />
            )
          );
        })}
    </>
  );
};

export default Markers;
