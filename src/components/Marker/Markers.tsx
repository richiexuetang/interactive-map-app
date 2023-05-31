import React, { useEffect } from "react";

import { useMapContext } from "src/context/app-context";
import CustomMarker from "./CustomMarker";
import { useMarkerContext } from "src/context/marker-context";
import useLocalStorage from "@hooks/useLocalStorage";
import {
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";

const Markers = (props) => {
  const { setHideCompleted } = useMarkerContext();
  const { useMap } = props;
  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings);
  const { markers, game: gameSlug, canvasCategories } = useMapContext();

  useEffect(() => {
    if (userSettings && userSettings[SETTING_HIDE_COMPLETED][gameSlug]) {
      setHideCompleted(true);
    } else {
      setHideCompleted(false);
    }
  }, [setHideCompleted]);

  return (
    <>
      {markers &&
        markers.map((marker, i) => {
          const inCanvas = canvasCategories.includes(marker.category);
          return (
            !inCanvas &&
            <CustomMarker
              key={i}
              useMap={useMap}
              marker={marker}
              rank={i}
              gameSlug={gameSlug}
            />
          );
        })}
    </>
  );
};

export default Markers;
