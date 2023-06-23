import { useMapContext } from "@context/app-context";
import { categoryHiddenState } from "@lib/getHiddenState";
import { useEffect } from "react";
import { Polyline } from "react-leaflet";
import useLocalStorageState from "use-local-storage-state";

const PolyLine = ({ path, parentId, categoryId, id }) => {
  const { config } = useMapContext();

  const [completionTrack, setCompletionTrack] = useLocalStorageState(
    "rm.completion_track",
    { defaultValue: { [config.name]: { completed: {}, category: {} } } }
  );
  const mapCompleteTrack = completionTrack[config.name];
  const complete = mapCompleteTrack?.["completed"];

  useEffect(() => {
    if (complete && complete[parentId] && !complete[id]) {
      setCompletionTrack((prev) => ({
        ...prev,
        [config.name]: {
          ...prev[config.name],
          completed: {
            ...prev[config.name]["completed"],
            [id]: categoryId,
          },
          category: {
            ...prev[config.name]["category"],
            [categoryId]: prev[config.name]["category"][categoryId] + 1
          },
        },
      }));
    } else if (complete && !complete[parentId] && complete[id]) {
      setCompletionTrack((prev) => ({
        ...prev,
        [config.name]: {
          ...prev[config.name],
          completed: {
            ...prev[config.name]["completed"],
            [id]: null,
          },
          category: {
            ...prev[config.name]["category"],
            [categoryId]: prev[config.name]["category"][categoryId] - 1
          },
        },
      }));
    }
  }, [complete[parentId]]);

  if ((complete && complete[parentId]) || categoryHiddenState(categoryId)) {
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
