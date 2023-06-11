import { useLocalStorage } from "@hooks/index";
import Polyline from "./PolyLine";

import { useMapContext } from "@context/app-context";
import { COMPLETED } from "@data/LocalStorage";
import { categoryHiddenState } from "@lib/getHiddenState";

const PolyLines = () => {
  const { pathMarkers } = useMapContext();
  const [completedMarkers] = useLocalStorage(COMPLETED, {});

  return (
    <>
      {pathMarkers &&
        pathMarkers.map(({ parentId, path }) => {
          return (
            !completedMarkers[parentId] && !categoryHiddenState(89) && (
              <Polyline key={parentId} path={path} />
            )
          );
        })}
    </>
  );
};

export default PolyLines;
