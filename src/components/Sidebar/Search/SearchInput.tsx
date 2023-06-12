import React, { useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
} from "@chakra-ui/react";
import { useMapContext } from "@context/app-context";
import { Search2Icon } from "@chakra-ui/icons";

const SearchInput = ({ setResults, setSearching, setSearchState }) => {
  const [value, setValue] = useState("");
  let seen = new Set();
  const { config } = useMapContext();

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      await search(e.target.value);
    }
  };

  const search = async (searchParam) => {
    setSearching(true);
    setResults([]);
    seen = new Set();

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

  return (
    <>
      <InputGroup borderRadius={0} size="sm">
        <InputLeftElement
          pointerEvents="none"
          children={<Search2Icon color="#af894d" />}
        />
        <Input
          variant="outlined"
          border="1px solid #584835"
          // borderColor="#584835"
          focusBorderColor="#af894d"
          placeholder="Search..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setResults([]);
            setSearchState("IDLE");
          }}
          onReset={() => {
            setValue("");
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
