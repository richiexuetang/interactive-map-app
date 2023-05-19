import React from "react";
import { useMapContext } from "src/context/app-context";
import CustomMarker from "./CustomMarker";

const Markers = (props) => {
  const { useMap, gameSlug } = props;
  const { markers } = useMapContext();

  return (
    <>
      {markers &&
        markers.map((marker, i) => {
          return (
            <CustomMarker
              key={i}
              useMap={useMap}
              marker={marker}
              rank={i}
              gameSlug={gameSlug}
            />
          );
        })}
    </>
  );
};

export default Markers;
