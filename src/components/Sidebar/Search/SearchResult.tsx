import React, { useRef} from "react";
import {Box, Image} from "@chakra-ui/react";

const SearchResult = ({result, markerRef, game, useMap}) => {
    const {_id: id, category, title, coord, descriptions} = result;
    const ref = useRef(null);
    const map = useMap();

    const goToPosition = (pos) => {
        map.flyTo(pos, map.getMaxZoom(), {animate: true, duration: 0.5});
    };

    return (
        <Box
            key={id}
            borderTop="1px solid #584835"
            _hover={{bg: "#141310"}}
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
                    <Image src={`/images/icons/${game}/${category}.png`} />
                </Box>

                <Box key={id}>{title} </Box>
            </Box>

            <Box>
                {descriptions.map((desc) => {
                    return (
                        <Box mb="1rem" key={desc}>
                            <div dangerouslySetInnerHTML={{__html: desc}} />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default SearchResult;
