import React from "react";
import TextContainer from "./TextContainer";

const TextLayer = (props) => {
  const {textOverlay} = props;

  return (
    <>
      {textOverlay.map(({ _id, coordinate, zoomRange, markerName }) => {
        return (
          <TextContainer
            key={_id}
            id={_id}
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
