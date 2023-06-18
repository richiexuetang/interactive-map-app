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
  Flex,
  Image,
} from "@chakra-ui/react";
import { ChakraStylesConfig, Select } from "chakra-react-select";
import {
  COMPLETED,
  SETTING_TRACKER,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";
import { useMapContext } from "@context/app-context";
import { categoryIdNameMap } from "@data/categoryItemsConfig";

function ProgressTracker() {
  const chakraStyles: ChakraStylesConfig = {
    option: (provided) => ({
      ...provided,
      backgroundColor: "app.modal",
      _hover: { bg: "app.background" },
    }),
    groupHeading: (provided) => ({
      ...provided,
      backgroundColor: "app.modal",
      color: "app.text",
      fontSize: "12px",
      fontWeight: 650,
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: "app.modal",
    }),
  };

  const { markerGroups, categoryCounts, config } = useMapContext();
  const { gameSlug, name: mapSlug } = config;
  const [completedMarkers] = useLocalStorage(COMPLETED, {});
  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );
  const [trackedCategory, setTrackedCategory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trackingOptions, setTrackingOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const trackSettings = userSettings[SETTING_TRACKER];

    if (!trackSettings?.hasOwnProperty(gameSlug)) {
      setUserSettings((prev) => ({
        ...prev,
        [SETTING_TRACKER]: {
          ...prev[SETTING_TRACKER],
          [gameSlug]: {},
        },
      }));
    }
    if (!trackSettings[gameSlug]?.hasOwnProperty(mapSlug)) {
      setUserSettings((prev) => ({
        ...prev,
        [SETTING_TRACKER]: {
          ...prev[SETTING_TRACKER],
          [gameSlug]: {
            ...prev[SETTING_TRACKER][gameSlug],
            [mapSlug]: [],
          },
        },
      }));
    } else {
      const tracked = userSettings[SETTING_TRACKER][gameSlug][mapSlug];
      setTrackedCategory([...tracked]);
    }
  }, [userSettings]);

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
              {
                value: categoryId,
                label: categoryIdNameMap[categoryId],
                group: group.toUpperCase(),
              },
            ],
          };
          tempOptions = [...tempOptions, newGroupOption];
        } else {
          optionGroup.options = [
            ...optionGroup.options,
            {
              value: categoryId,
              label: categoryIdNameMap[categoryId],
              group: group.toUpperCase(),
            },
          ];
        }
      });
      setTrackingOptions([...tempOptions]);
    }
  }, [userSettings[SETTING_TRACKER]]);

  const getCompletedCount = (categoryId) => {
    let result = 0;
    const { ids } = markerGroups.find((item) => item.categoryId === categoryId);

    if (!ids) return 0;

    for (const key in completedMarkers) {
      result = completedMarkers[key] === categoryId ? result + 1 : result;
    }
    return result;
  };

  const removeTrackedCategory = (category) => {
    const newList = userSettings[SETTING_TRACKER][gameSlug][mapSlug].filter(item => item !== category);
    setUserSettings((prev) => ({
      ...prev,
      [SETTING_TRACKER]: {
        ...prev[SETTING_TRACKER],
        [gameSlug]: {
          ...prev[SETTING_TRACKER][gameSlug],
          [mapSlug]: newList,
        },
      },
    }));
  };

  const prepareCategoriesToTrack = (values) => {
    values.map((item) => {
      if (!selectedCategories.includes(item.value)) {
        setSelectedCategories((prev) => [...prev, item.value]);
      }
    });
  };

  const trackCategories = () => {
    const tracked = userSettings[SETTING_TRACKER][gameSlug][mapSlug];
    selectedCategories.map((value) => {
      if (!tracked.includes(value)) {
        setUserSettings((prev) => ({
          ...prev,
          [SETTING_TRACKER]: {
            ...prev[SETTING_TRACKER],
            [gameSlug]: {
              ...prev[SETTING_TRACKER][gameSlug],
              [mapSlug]: [...prev[SETTING_TRACKER][gameSlug][mapSlug], value],
            },
          },
        }));
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
            <CardBody px="0">
              {trackedCategory.map((category) => (
                <Button
                  display="flex"
                  flexDir="row"
                  justifyContent="space-between"
                  w="full"
                  bg="sidebar.content"
                  mb={5}
                >
                  <Flex w={5} h={6} alignItems="center" justifyContent="center">
                    <Image
                      src={`/images/icons/${category}.png`}
                      alt={`/images/icons/${category}.png`}
                      fallbackSrc="/images/icons/111.png"
                    />
                  </Flex>
                  <Box>{categoryIdNameMap[category]}</Box>
                  <Box>
                    {getCompletedCount(category)}/{categoryCounts[category]}
                  </Box>
                  <CloseButton
                    onClick={() => removeTrackedCategory(category)}
                  />
                </Button>
              ))}

              <HStack justifyContent="center">
                {trackingOptions.length && (
                  <Select
                    chakraStyles={chakraStyles}
                    isMulti
                    name="trackCategories"
                    options={trackingOptions}
                    placeholder="Select categories to track..."
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
              </HStack>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ProgressTracker;