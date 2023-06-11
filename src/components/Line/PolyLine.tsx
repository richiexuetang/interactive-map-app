import { Polyline } from "react-leaflet";

const PolyLine = ({ path }) => {
  return (
    <Polyline
      positions={[
        [path[0][0], path[0][1]],
        [path[1][0], path[1][1]],
      ]}
      color={"white"}
      weight={1}
    />
  );
};

export default PolyLine;
