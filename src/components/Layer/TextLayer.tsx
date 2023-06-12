import React from "react";
import TextContainer from "./TextContainer";
import { useMapContext } from "@context/app-context";

const TextLayer = (props) => {
  const {textOverlay} = props;

  return (
    <>
      {textOverlay.map(({ id, coordinate, zoomRange, markerName }) => {
        return (
          <TextContainer
            key={id}
            id={id}
            position={coordinate}
            content={markerName}
            maxZoom={zoomRange[0]}
            minZoom={zoomRange[1]}
          />
        );
      })}
    </>
  );
};

export default TextLayer;
