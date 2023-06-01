import { Polyline } from "react-leaflet";

import {
  SETTING_HIDDEN_CATEGORY,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
  pointsData,
} from "@data/index";
import { useMapContext } from "@context/app-context";
import { COMPLETED } from "@data/index";
import useLocalStorage from "@hooks/useLocalStorage";

const PolyLines = () => {
  const { game, area } = useMapContext();
  const [completedMarkers] = useLocalStorage(COMPLETED, {});
  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings);

  return (
    <>
      {game === "totk" &&
        area === "hyrule-surface" &&
        pointsData.map(
          ({ startLat, startLong, id, endLat, endLong, category }) => {
            const hideCategory =
              userSettings[SETTING_HIDDEN_CATEGORY][game][category];

            const hideComplete =
              userSettings[SETTING_HIDE_COMPLETED][game] &&
              completedMarkers[id];
              
            const shouldHide = hideCategory || hideComplete;

            if (!shouldHide) {
              return (
                <Polyline
                  key={id}
                  positions={[
                    [startLat, startLong],
                    [endLat, endLong],
                  ]}
                  color={"white"}
                  weight={1}
                />
              );
            }
          }
        )}
    </>
  );
};

export default PolyLines;
