import { useMapContext } from "@context/app-context";
import { useMarkerContext } from "@context/marker-context";
import { COMPLETED, USER_SETTING, initialUserSettings } from "@data/index";
import useLocalStorage from "@hooks/useLocalStorage";
import { Polyline } from "react-leaflet";

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

  const pointsData = [
    {
      startLat: 0.7295902494300266,
      startLong: -0.5696356192571383,
      id: "646c46476fda291c359376d3",
      endLat: 0.7280110287510854,
      endLong: -0.5627306586443327,
      category: "seed",
    },
    {
      startLat: 0.8013871542183558,
      startLong: -0.6874231335368531,
      id: "646946576fda291c35936395",
      endLat: 0.801080464600527,
      endLong: -0.6839506294042931,
      category: "seed",
    },
  ];

  return (
    <>
      {game === "totk" &&
        pointsData.map(
          ({ startLat, startLong, id, endLat, endLong, category }) => {
            const shouldHide = (hideCompleted && completedMarkers[id]) || hiddenCategories[category];
            
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
