import React, { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";

import { useMapContext } from "@context/app-context";
import { Loader } from "@components/Loader";

const SearchInput = ({ results, setResults }) => {
  const { area } = useMapContext();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  let seen = new Set();

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/markers?area=` + area,
      {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setMarkers([...json]), setIsLoading(false);
      });
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setResults([]);
      seen = new Set();

      markers
        .filter((marker) =>
          marker.title.toLowerCase().includes(value.toLowerCase())
        )
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

  if (isLoading) {
    return <Loader loading={isLoading} />
  }
  
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
