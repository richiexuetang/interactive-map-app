import React from "react";
import {Box} from "@chakra-ui/react";

import {SearchResult} from ".";

const SearchResults = ({results, markerRefs, game, useMap}) => {
    return (
        <Box overflow="scroll" _hover={{cursor: "pointer"}}>
            {results.map((result) => (
                <SearchResult key={result._id} result={result} markerRef={markerRefs[result._id]} game={game} useMap={useMap}/>
            ))}
        </Box>
    );
};

export default SearchResults;
