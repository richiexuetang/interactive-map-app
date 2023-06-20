import { useMapContext } from "@context/app-context";
import { COMPLETION_TRACK } from "@data/LocalStorage";
import { useLocalStorage } from "@hooks/index";
import { categoryHiddenState } from "@lib/getHiddenState";
import { useEffect } from "react";
import { Polyline } from "react-leaflet";

const PolyLine = ({ path, parentId, categoryId, id }) => {
  const { config } = useMapContext();

  const [completionTrack, setCompletionTrack] = useLocalStorage(
    COMPLETION_TRACK,
    { [config.name]: { completed: {}, category: {} } }
  );
  const mapCompleteTrack = completionTrack[config.name]
  const complete = mapCompleteTrack?.["completed"];

  useEffect(() => {
    if (complete && complete[parentId] && !complete[id]) {
      setCompletionTrack((prev) => ({
        ...prev,
        [config.name]: { ...prev[config.name], completed: {
          ...prev[config.name]["completed"],
          [id]: categoryId
        } },
      }));
    } else if (complete && !complete[parentId] && complete[id]) {
      setCompletionTrack((prev) => ({
        ...prev,
        [config.name]: { ...prev[config.name], completed: {
          ...prev[config.name]["completed"],
          [id]: null
        } },
      }));
    }
  }, [completionTrack]);

  if ((complete &&complete[parentId]) || categoryHiddenState(categoryId)) {
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
