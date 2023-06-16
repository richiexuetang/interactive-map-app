import React, { useEffect, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Button,
  HStack,
  Card,
  CardBody,
  CardHeader,
  CloseButton,
  Box,
  Text,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { COMPLETED, initialUserSettings } from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";
import { useMapContext } from "@context/app-context";
import { categoryIdNameMap } from "@data/categoryItemsConfig";

function ProgressTracker() {
  const { markerGroups, categoryCounts } = useMapContext();
  const [completedMarkers] = useLocalStorage(COMPLETED, initialUserSettings);
  const [trackedCategory, setTrackedCategory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trackingOptions, setTrackingOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (!trackingOptions.length) {
      let tempOptions = [];
      markerGroups.map(({ group, categoryId }) => {
        const optionGroup = tempOptions.find(
          (item) => item.label === group.toUpperCase()
        );
        if (!optionGroup) {
          const newGroupOption = {
            label: group.toUpperCase(),
            options: [
              { value: categoryId, label: categoryIdNameMap[categoryId] },
            ],
          };
          tempOptions = [...tempOptions, newGroupOption];
        } else {
          optionGroup.options = [
            ...optionGroup.options,
            { value: categoryId, label: categoryIdNameMap[categoryId] },
          ];
        }
      });
      setTrackingOptions([...tempOptions]);
    }
  });

  const getCompletedCount = (categoryId) => {
    let result = 0;
    const { ids } = markerGroups.find((item) => item.categoryId === categoryId);

    if (!ids) {
      return 0;
    }

    for (const key in completedMarkers) {
      result = ids.includes(key) ? result + 1 : result;
      continue;
    }
    return result;
  };

  const removeTrackedCategory = (category) => {
    setTrackedCategory(trackedCategory.filter((item) => item !== category));
  };

  const prepareCategoriesToTrack = (values) => {
    values.map(({ value }) => {
      setSelectedCategories((prev) => [...prev, value]);
    });
  };

  const trackCategories = () => {
    selectedCategories.map((selected) => {
      if (!trackedCategory.includes(selected)) {
        setTrackedCategory((prev) => [...prev, selected]);
      }
    });
    setSelectedCategories([]);
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
                <HStack mb={5} key={category}>
                  <Box>{categoryIdNameMap[category]}</Box>
                  <Box>
                    {getCompletedCount(category)}/{categoryCounts[category]}
                  </Box>
                  <CloseButton
                    onClick={() => removeTrackedCategory(category)}
                  />
                </HStack>
              ))}

              {trackingOptions.length && (
                <Select
                  isMulti
                  name="trackCategories"
                  options={trackingOptions}
                  placeholder="Select some categories to track..."
                  closeMenuOnSelect={false}
                  size="sm"
                  onChange={(e) => prepareCategoriesToTrack(e)}
                />
              )}

              {selectedCategories && (
                <Button onClick={trackCategories} mt={6}>
                  Track
                </Button>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ProgressTracker;
