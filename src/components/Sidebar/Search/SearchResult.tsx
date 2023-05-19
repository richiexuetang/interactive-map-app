import React, { useRef } from "react";
import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useMapContext } from "src/context/app-context";

const SearchResult = ({ result, useMap }) => {
  const { game } = useMapContext();
  const { _id: id, category, title, coord, descriptions } = result;
  const ref = useRef(null);
  const map = useMap();

  const goToPosition = (pos) => {
    map.flyTo(pos, map.getMaxZoom(), { animate: true, duration: 0.5 });
  };

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
