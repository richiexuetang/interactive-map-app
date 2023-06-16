import React, { useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Button,
  HStack,
  Card,
  CardBody,
  CardHeader,
  CloseButton,
  Select,
  Box,
  Text,
} from "@chakra-ui/react";
import { COMPLETED, initialUserSettings } from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";
import { useMapContext } from "@context/app-context";
import { categoryIdNameMap } from "@data/categoryItemsConfig";

function ProgressTracker() {
  const { categoryMap, markerGroups, categoryCounts } = useMapContext();
  const [completedMarkers] = useLocalStorage(COMPLETED, initialUserSettings);
  const [trackedCategory, setTrackedCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getCompletedCount = (categoryId) => {
    let result = 0;
    for (const key in completedMarkers) {
      markerGroups.map((group) => {
        if (group.categoryId === categoryId) {
          group.ids.some((id) => {
            if (id === key && categoryId === completedMarkers[key]) {
              result++;
              return;
            }
          });
        }
      });
    }
    return result;
  };

  const trackCategory = () => {
    setTrackedCategory((prev) => [...prev, selectedCategory]);
    const count = getCompletedCount(parseInt(selectedCategory));
    console.log(count);
  };

  return (
    <div className="leaflet-top leaflet-left">
      <div className="leaflet-control leaflet-bar">
        {!sidebarOpen ? (
          <>
            <IconButton
              icon={
                sidebarOpen ? (
                  <ChevronLeftIcon w="23px" h="48px" />
                ) : (
                  <ChevronRightIcon w="23px" h="48px" />
                )
              }
              zIndex="1000"
              float="left"
              left={1}
              top="3px"
              bg="#221c0f"
              pos="absolute"
              colorScheme="sidebarArrow"
              variant="outline"
              cursor="pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="sidebar-button"
            />
          </>
        ) : (
          <Card colorScheme="app.modal" w="sm">
            <CardHeader>
              <HStack justifyContent="space-between">
                <Text fontSize="lg">Progress Tracker</Text>
                <CloseButton onClick={() => setSidebarOpen(false)} />
              </HStack>
            </CardHeader>
            <CardBody>
              {trackedCategory.map((category) => (
                <HStack mb={5}>
                  <Box>{categoryIdNameMap[category]}</Box>
                  <Box>
                    {getCompletedCount(parseInt(category))} /{" "}
                    {categoryCounts[parseInt(category)]}
                  </Box>
                </HStack>
              ))}

              <Select
                name="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                mb={5}
              >
                {categoryMap.map((category) => {
                  return (
                    <option value={category}>
                      {categoryIdNameMap[category]}
                    </option>
                  );
                })}
              </Select>
              {selectedCategory && (
                <Button onClick={trackCategory}>Track Category</Button>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ProgressTracker;
