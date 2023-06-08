import React, { useState } from "react";
import { Input } from "@chakra-ui/react";
import { useMapContext } from "@context/app-context";

const SearchInput = ({ setResults }) => {
  const [value, setValue] = useState("");
  let seen = new Set();
  const {config} = useMapContext();

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      setResults([]);
      seen = new Set();

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/findMarker?searchParam=` +
            e.target.value + `&mapSlug=${config.name}`
        );
        const json = await res.json();
        setResults([...json]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Input
      variant="outlined"
      borderColor="#584835"
      focusBorderColor="#af894d"
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
