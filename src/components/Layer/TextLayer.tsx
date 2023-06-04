import React from "react";
import TextContainer from "./TextContainer";
import { icons } from "@data/iconData";

const TextLayer = () => {
  return (
    <>
      {icons.map(({ title, position, maxZoom, minZoom, game, area }) => {
        return (
          <TextContainer
            key={title}
            position={position}
            content={title}
            maxZoom={maxZoom}
            minZoom={minZoom}
            game={game}
            area={area}
          />
        );
      })}
    </>
  );
};

export default TextLayer;
