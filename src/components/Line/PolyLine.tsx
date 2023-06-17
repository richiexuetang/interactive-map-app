import { COMPLETED } from "@data/LocalStorage";
import { useLocalStorage } from "@hooks/index";
import { categoryHiddenState } from "@lib/getHiddenState";
import { useEffect } from "react";
import { Polyline } from "react-leaflet";

const PolyLine = ({ path, parentId, categoryId, id }) => {
  const [completedMarkers, setCompletedMarkers] = useLocalStorage(
    COMPLETED,
    {}
  );

  useEffect(() => {
    if (completedMarkers[parentId] && !completedMarkers[id]) {
      setCompletedMarkers((prev) => ({ ...prev, [id]: categoryId }));
    } else if (!completedMarkers[parentId] && completedMarkers[id]) {
      setCompletedMarkers((prev) => ({ ...prev, [id]: null }));
    }
  });

  if (completedMarkers[parentId] || categoryHiddenState(categoryId)) {
    return null;
  }

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
