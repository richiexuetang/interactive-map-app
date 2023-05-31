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
    {
        startLat: 0.7998354503416558,
        startLong: -0.6628629845017998,
        id: "646946576fda291c35936397",
        endLat: 0.7950415432894103,
        endLong: -0.6782221982743254,
        category: "seed",
    },
    {
        startLat: 0.7983278911846298,
        startLong: -0.7778745325304071,
        id: "646946526fda291c3593614f",
        endLat: 0.8002569026445439,
        endLong: -0.7794739540712172,
        category: "seed",
    },
    {
        startLat: 0.7945085387167313,
        startLong: -0.7940958314638903,
        id: "646c464a6fda291c3593785f",
        endLat: 0.795089059258667,
        endLong: -0.7933071239006707,
        category: "seed",
    },
    // {
    //     startLat: ,
    //     startLong: ,
    //     id: "",
    //     endLat: ,
    //     endLong: ,
    //     category: "seed",
    // }
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
