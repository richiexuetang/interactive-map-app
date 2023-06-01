import { Polyline } from "react-leaflet";

import { pointsData } from "@data/index";
import { useMapContext } from "@context/app-context";
import { useMarkerContext } from "@context/marker-context";
import { COMPLETED } from "@data/index";

const PolyLines = () => {
  const { game, areaId } = useMapContext();
  const { hideCompleted, hiddenCategories } =
    useMarkerContext();
  const completedMarkers =
    JSON.parse(window.localStorage.getItem(COMPLETED)) || {};

  return (
    <>
      {game === "totk" && areaId === "hyrule-surface" &&
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
