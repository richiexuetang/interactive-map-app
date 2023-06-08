import React from "react";
import {Box} from "@chakra-ui/react";

import {SearchResult} from ".";

const SearchResults = ({results}) => {
    return (
        <Box overflow="scroll" _hover={{cursor: "pointer"}}>
            {results.map((result, i) => (
                <SearchResult key={i} result={result} />
            ))}
        </Box>
    );
};

export default SearchResults;
