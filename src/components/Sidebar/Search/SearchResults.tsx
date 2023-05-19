import React from "react";
import {Box} from "@chakra-ui/react";

import {SearchResult} from ".";

const SearchResults = ({results, useMap}) => {
    return (
        <Box overflow="scroll" _hover={{cursor: "pointer"}}>
            {results.map((result) => (
                <SearchResult key={result._id} result={result} useMap={useMap}/>
            ))}
        </Box>
    );
};

export default SearchResults;
