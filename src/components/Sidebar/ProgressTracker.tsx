import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Button,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Box,
  Text,
  Flex,
  Image,
  VStack,
} from "@chakra-ui/react";
import { ChakraStylesConfig, Select } from "chakra-react-select";
import {
  COMPLETION_TRACK,
  SETTING_TRACKER,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";
import { useMapContext } from "@context/app-context";
import { categoryIdNameMap } from "@data/categoryItemsConfig";

function ProgressTracker({ markerGroups }) {
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

  const { categoryCounts, config } = useMapContext();
  const { gameSlug, name: mapSlug } = config;

  const [completionTrack] = useLocalStorage(
    COMPLETION_TRACK,
    { [mapSlug]: { completed: {}, category: {} } }
  );

  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );

  const [trackedCategory, setTrackedCategory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trackingOptions, setTrackingOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const trackingSetting = userSettings[SETTING_TRACKER];

  useMemo(() => {
    if (!trackingSetting?.hasOwnProperty(gameSlug)) {
      setUserSettings((prev) => ({
        ...prev,
        [SETTING_TRACKER]: {
          ...prev[SETTING_TRACKER],
          [gameSlug]: {},
        },
      }));
    }
    if (!trackingSetting[gameSlug]?.hasOwnProperty(mapSlug)) {
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

  const getCompletedCount = useCallback((categoryId) => {
    let result = 0;
    const { ids } = markerGroups.find((item) => item.categoryId === categoryId);

    if (!ids) return 0;

    const mapCompleteInfo = completionTrack[config.name];

    for (const key in mapCompleteInfo?.["completed"]) {
      result = completionTrack[config.name]["completed"][key] === categoryId ? result + 1 : result;
    }
    return result;
  }, [completionTrack]);

  const removeTrackedCategory = (category) => {
    const newList = userSettings[SETTING_TRACKER][gameSlug][mapSlug].filter(
      (item) => item !== category
    );
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
    let tracked = userSettings[SETTING_TRACKER][gameSlug][mapSlug];
    selectedCategories.map((value) => {
      if (!tracked.includes(value)) {
        tracked = [...tracked, value];
        setUserSettings((prev) => ({
          ...prev,
          [SETTING_TRACKER]: {
            ...prev[SETTING_TRACKER],
            [gameSlug]: {
              ...prev[SETTING_TRACKER][gameSlug],
              [mapSlug]: tracked,
            },
          },
        }));
      }
    });

    setSelectedCategories([]);
  };

  return (
    <div className="leaflet-top leaflet-left">
      <div className="leaflet-control leaflet-bar" style={{ margin: "0" }}>
        {!sidebarOpen ? (
          <Box
            onClick={() => setSidebarOpen(!sidebarOpen)}
            bg="#221c0f"
            px={2}
            py={4}
            mt={4}
            _hover={{ cursor: "pointer", border: "1px solid #fbe4bd" }}
          >
            &gt;
          </Box>
        ) : (
          <Card colorScheme="app.modal" maxW="300px">
            <CardHeader>
              <HStack justifyContent="space-between">
                <Text fontSize="lg">Progress Tracker</Text>
                <Box
                  _hover={{
                    cursor: "pointer",
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  X
                </Box>
              </HStack>
            </CardHeader>
            <CardBody px={2}>
              {trackedCategory.map((category) => (
                <Flex key={category} mb={5} alignItems="center">
                  <Button
                    justifyContent="space-between"
                    w="full"
                    bg="sidebar.content"
                    _hover={{ bg: "#2a2927" }}
                    py="0"
                    px={2}
                  >
                    <Flex w={5} h={6}>
                      <Image
                        src={`/images/icons/${category}.png`}
                        alt={`/images/icons/${category}.png`}
                        fallbackSrc="/images/icons/111.png"
                      />
                    </Flex>
                    <Text fontWeight="normal">
                      {categoryIdNameMap[category]}
                    </Text>
                    <Text fontWeight="normal">
                      {getCompletedCount(category)}/{categoryCounts[category]}
                    </Text>
                  </Button>
                  <Box
                    onClick={() => removeTrackedCategory(category)}
                    _hover={{
                      cursor: "pointer",
                      border: "1px solid #fbe4bd",
                    }}
                    border="1px solid #967959"
                    px={2}
                    mr={2}
                  >
                    X
                  </Box>
                </Flex>
              ))}

              <VStack gap={2}>
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
                  <Button
                    onClick={trackCategories}
                    _hover={{ border: "1px solid #fbe4bd" }}
                    mt={10}
                  >
                    <Text>Track</Text>
                  </Button>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ProgressTracker;
