import Polyline from "./PolyLine";

import { useMapContext } from "@context/app-context";

const PolyLines = () => {
  const { pathMarkers } = useMapContext();
  
  return (
    <>
      {pathMarkers &&
        pathMarkers.map(({parentId, path}) => {
          return (
            <Polyline
              key={parentId}
              parentId={parentId}
              path={path}
            />
          );
        })}
    </>
  );
};

export default PolyLines;
