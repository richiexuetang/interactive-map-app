import { Polyline } from "react-leaflet";

import { pointsData } from "@data/index";
import { useMapContext } from "@context/app-context";
import { useMarkerContext } from "@context/marker-context";
import { COMPLETED, USER_SETTING, initialUserSettings } from "@data/index";
import useLocalStorage from "@hooks/useLocalStorage";

const PolyLines = () => {
  const { game } = useMapContext();
  const { hideCompleted, setHiddenCategories, hiddenCategories } =
    useMarkerContext();
  const completedMarkers =
    JSON.parse(window.localStorage.getItem(COMPLETED)) || {};
  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );

  return (
    <>
      {game === "totk" &&
        pointsData.map(
          ({ startLat, startLong, id, endLat, endLong, category }) => {
            const shouldHide =
              (hideCompleted && completedMarkers[id]) ||
              hiddenCategories[category];

            if (!shouldHide) {
              return (
                <Polyline
                  key={id}
                  positions={[
                    [startLat, startLong],
                    [endLat, endLong],
                  ]}
                  color={"white"}
                />
              );
            }
          }
        )}
    </>
  );
};

export default PolyLines;
