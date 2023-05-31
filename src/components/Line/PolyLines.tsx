import { useMapContext } from "@context/app-context";
import { COMPLETED } from "@data/index";
import { Polyline } from "react-leaflet";

const PolyLines = () => {
  const { game } = useMapContext();
  const completedMarkers =
    JSON.parse(window.localStorage.getItem(COMPLETED)) || {};

  const pointsData = [
    {
      from_lat: 0.7295902494300266,
      from_long: -0.5696356192571383,
      id: "646c46476fda291c359376d3",
      to_lat: 0.7280110287510854,
      to_long: -0.5627306586443327,
    },
    {
      from_lat: 0.8013871542183558,
      from_long: -0.6874231335368531,
      id: "646946576fda291c35936395",
      to_lat: 0.801080464600527,
      to_long: -0.6839506294042931,
    },
  ];

  return (
    <>
      {game === "totk" &&
        pointsData.map(({ from_lat, from_long, id, to_lat, to_long }) => {
          if (!completedMarkers[id]) {
            return (
              <Polyline
                key={id}
                positions={[
                  [from_lat, from_long],
                  [to_lat, to_long],
                ]}
                color={"white"}
              />
            );
          }
        })}
    </>
  );
};

export default PolyLines;
