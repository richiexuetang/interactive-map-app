import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import L from "leaflet";

import { Box, Flex } from "@chakra-ui/react";

import { useMapContext } from "src/context/app-context";
import { useMap } from "react-leaflet";
import { useRouter } from "next/router";

const SearchResult = ({ result }) => {
  const router = useRouter();
  const { markerRefs, config } = useMapContext();
  const {
    _id: id,
    categoryId,
    markerName,
    descriptions,
    coordinate,
    mapSlug,
  } = result;

  const ref = useRef(null);
  const map = useMap();
  const [markerOverlays, setMarkerOverlays] = useState({});

  const goToPosition = () => {
    if (mapSlug === config.name) {
      map.flyTo(coordinate, map.getMaxZoom(), {
        animate: true,
        duration: 0.5,
      });
    } else {
      router.replace(`/map/${mapSlug}?markerId=${id}`, undefined, {
        shallow: true,
      });
    }
  };

  const handleMouseEnter = () => {
    if (markerRefs[id]) {
      const overlay = L.circle(markerRefs[id]._latlng, {
        radius: (1000 + map.getZoom() * 100) / map.getZoom(),
      });
      setMarkerOverlays({ ...markerOverlays, [id]: overlay });
      map.addLayer(overlay);
      map.flyTo(coordinate, map.getMaxZoom(), {
        animate: true,
        duration: 0.5,
      });
    }
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
      borderTop="1px solid #584835"
      _hover={{ bg: "#141310" }}
      pb="5px"
      onClick={goToPosition}
      ref={ref}
    >
      <Flex my="1rem">
        <Flex
          w="20px"
          h="22px"
          mr={2}
          alignItems="center"
          justifyContent="center"
        >
          <Image
            width={32}
            height={32}
            src={`/images/icons/${categoryId}.png`}
            alt={`${id}`}
            style={{ objectFit: "contain", width: "auto", height: "auto" }}
          />
        </Flex>

        <Box>{markerName} </Box>
      </Flex>

      {descriptions.map((desc, i) => {
        return (
          <Box mb="1rem" key={id + i}>
            <div dangerouslySetInnerHTML={{ __html: desc }} />
          </Box>
        );
      })}
    </Box>
  );
};

export default SearchResult;
