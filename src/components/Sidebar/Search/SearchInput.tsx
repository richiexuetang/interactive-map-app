import React, {useState} from "react";
import {Input} from "@chakra-ui/react";

import { useMapContext } from "@context/app-context";

const SearchInput = ({results, setResults}) => {
    const {markers} = useMapContext();
    const [value, setValue] = useState("");
    let seen = new Set();

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            setResults([]);
            seen = new Set();

            markers
                .filter((marker) => marker.title.toLowerCase().includes(value.toLowerCase()))
                .map((filtered) => {
                    const newArr = results;
                    newArr.push(filtered);
                    setResults([...newArr]);
                    seen = new Set([...seen, filtered._id]);      
                });

            markers.map((marker) =>
                marker.descriptions
                    .filter((desc) => desc.toLowerCase().includes(value.toLowerCase()))
                    .map(() => {
                        if (!seen.has(marker._id)) {
                            const newArr = results;
                            newArr.push(marker);
                            setResults([...newArr]);
                        }
                    })
            );
        }
    };

    return (
        <Input
            variant='outlined'
            borderColor='#584835'
            focusBorderColor='#af894d'
            placeholder="Search..."
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                setResults([]);
            }}
            onReset={() => {
                setValue("");
                setResults([]);
            }}
            onKeyUp={(e) => handleKeyPress(e)}
        />
    );
};

export default SearchInput;
