import React, { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useMapContext } from "src/context/app-context";
import L from "leaflet";

const SearchResult = ({ result, useMap }) => {
  const { game, markerRefs } = useMapContext();
  const { _id: id, category, title, coord, descriptions } = result;
  const ref = useRef(null);
  const map = useMap();
  const [markerOverlays, setMarkerOverlays] = useState({});

  const goToPosition = (pos) => {
    map.flyTo(pos, map.getMaxZoom() - 1, { animate: true, duration: 0.5 });
  };

  const handleMouseEnter = () => {
    const overlay = L.circle(markerRefs[id]._latlng, {
      radius: (1000 + map.getZoom() * 100) / map.getZoom(),
    });

    setMarkerOverlays({ ...markerOverlays, [id]: overlay });
    map.addLayer(overlay);
  };

  const handleMouseLeave = () => {
    if (id in markerOverlays) {
      map.removeLayer(markerOverlays[id]);

      const newData = { ...markerOverlays };
      delete newData[id];
      setMarkerOverlays({ ...newData });
    }
  };

  useEffect(() => {
    const el = ref?.current;
    if (el) {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  });

  return (
    <Box
      key={id}
      borderTop="1px solid #584835"
      _hover={{ bg: "#141310" }}
      pb="5px"
      onClick={() => goToPosition(coord)}
      ref={ref}
    >
      <Box display="flex" my="1rem">
        <Box
          w="20px"
          h="22px"
          display="flex"
          mr={2}
          alignItems="center"
          justifyContent="center"
        >
          <Image
            width={32}
            height={32}
            src={`/images/icons/${game}/${category}.png`}
            alt={`${game}-${category}`}
            style={{ objectFit: "contain" }}
          />
        </Box>

        <Box key={id}>{title} </Box>
      </Box>

      <Box>
        {descriptions.map((desc) => {
          return (
            <Box mb="1rem" key={desc}>
              <div dangerouslySetInnerHTML={{ __html: desc }} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SearchResult;
