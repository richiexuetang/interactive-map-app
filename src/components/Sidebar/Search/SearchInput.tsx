import React, { useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
} from "@chakra-ui/react";
import { CloseIcon, Search2Icon } from "@chakra-ui/icons";

import { useMapContext } from "@context/app-context";

const SearchInput = ({ setResults, setSearching, setSearchState }) => {
  const [value, setValue] = useState("");
  const { config } = useMapContext();

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      await search(e.target.value);
    }
  };

  const search = async (searchParam) => {
    setSearching(true);
    setResults([]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/findMarker?searchParam=` +
          searchParam +
          `&mapSlug=${config.name}`
      );
      const json = await res.json();
      setResults(json);
      setSearching(false);
      if (json.length) {
        setSearchState("COMPLETE");
      } else {
        setSearchState("NO RESULT");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetInput = () => {
    setValue("");
    setResults([]);
    setSearchState("IDLE");
  };

  return (
    <>
      <InputGroup borderRadius={0} size="sm">
        <InputLeftElement
          children={
            value ? (
              <CloseIcon
                color="#af894d"
                _hover={{ cursor: "pointer" }}
                onClick={resetInput}
              />
            ) : (
              <Search2Icon color="#af894d" />
            )
          }
        />
        <Input
          variant="outlined"
          placeholder="Search..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setResults([]);
            setSearchState("IDLE");
          }}
          onKeyUp={(e) => handleKeyPress(e)}
        />
        <InputRightAddon p={0} border="none">
          <Button
            size="sm"
            borderLeftRadius={0}
            borderRightRadius={3.3}
            border="1px solid #af894d"
            onClick={() => search(value)}
          >
            Search
          </Button>
        </InputRightAddon>
      </InputGroup>
    </>
  );
};

export default SearchInput;
