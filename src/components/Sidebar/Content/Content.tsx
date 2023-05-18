import React, { useState } from "react";
import { Box, HStack, VStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import useLocalStorage from "@hooks/useLocalStorage";
import { initialUserSettings } from "@data/LocalStorage/initial";
import { CategoryGroups } from "../CategoryGroup";
import { SearchInput, SearchResults } from "../Search";
import { SETTING_HIDE_ALL, SETTING_HIDE_COMPLETED } from "@data/LocalStorage";

const Content = ({
  markerRefs,
  game,
  categoryGroups,
  navSelections,
  area,
  categoryCounts,
  useMap,
  markers,
}) => {
  const router = useRouter();
  const map = useMap();

  const [userSettings, setUserSettings] = useLocalStorage(
    "interactive_map_user_setting",
    initialUserSettings
  );

  const [hideAllMarkers, setHideAllMarkers] = useState(
    userSettings[SETTING_HIDE_ALL][game]
  );
  const [hideCompleted, setHideCompleted] = useState(
    userSettings[SETTING_HIDE_COMPLETED][game]
  );

  const [results, setResults] = useState([]);

  const toggle = (settingKey) => {
    const current = userSettings[settingKey][game];
    const copy = {...userSettings};
    copy[settingKey][game] = !current;
    
    if (settingKey === SETTING_HIDE_COMPLETED) {
      setHideCompleted(!current);
    } else if (settingKey === SETTING_HIDE_ALL){
      setHideAllMarkers(!current);
    }

    setUserSettings({ ...copy });
  }

  const navigateToArea = (selection) => {
    const { to } = selection;

    if (!map) {
      return;
    }

    if (to === area) {
      // console.log("" + map.getCenter().lat + "," + map.getCenter().lng);
      // console.log(map.getZoom());

      map.flyTo(selection.location, selection.zoom, {
        animate: true,
        duration: 0.5,
      });
    } else {
      router.push(`/map/${to}`);
    }
  };

  return (
    <VStack>
      <HStack>
        <Button onClick={() => toggle(SETTING_HIDE_ALL)} variant="underlined" fontSize="12px">
          {hideAllMarkers ? "Show All" : "Hide All"}
        </Button>
        <Button onClick={() => toggle(SETTING_HIDE_COMPLETED)} variant="underlined" fontSize="12px">
          {hideCompleted ? "Show Completed" : "Hide Completed"}
        </Button>
      </HStack>

      <Box mt={5}>
        <SearchInput
          results={results}
          setResults={setResults}
          markers={markers}
        />
      </Box>

      {navSelections && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          {navSelections.map((selection) => (
            <Button
              key={selection.name}
              variant="mapLink"
              flex={selection.flex}
              onClick={() => navigateToArea(selection)}
            >
              {selection.name}
            </Button>
          ))}
        </Box>
      )}

      <Box w="100%" p={4} pb={0}>
        {results && results.length ? (
          <SearchResults
            results={results}
            markerRefs={markerRefs}
            game={game}
            useMap={useMap}
          />
        ) : (
          <CategoryGroups
            categoryGroups={categoryGroups}
            game={game}
            categoryCounts={categoryCounts}
          />
        )}
      </Box>
    </VStack>
  );
};

export default Content;
