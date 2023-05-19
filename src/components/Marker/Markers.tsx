import React, { useEffect } from "react";
import { useMapContext } from "src/context/app-context";
import CustomMarker from "./CustomMarker";
import { useMarkerContext } from "src/context/marker-context";
import useLocalStorage from "@hooks/useLocalStorage";
import {
  SETTING_HIDE_ALL,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";

const Markers = (props) => {
  const { setHideAll, setHideCompleted } = useMarkerContext();
  const { useMap, gameSlug } = props;
  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings);
  const { markers } = useMapContext();

  useEffect(() => {
    if (userSettings && userSettings[SETTING_HIDE_ALL][gameSlug]) {
      setHideAll(true);
    } else {
      setHideAll(false);
    }
  }, [setHideAll]);

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
          return (
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
