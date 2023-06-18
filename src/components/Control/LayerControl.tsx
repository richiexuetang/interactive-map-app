import React, { useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";
import { Util } from "leaflet";
import { LayersControlProvider } from "@context/layer-control-context";
import createControlledLayer from "./controlledLayer";

import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  VStack,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useMapContext } from "@context/app-context";
import { SearchInput, SearchResults } from "@components/Sidebar";
import {
  SETTING_HIDDEN_CATEGORY,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import { useRouter } from "next/router";
import useLocalStorage from "@hooks/useLocalStorage";
import GroupContainer from "@components/Sidebar/CategoryGroup/GroupContainer";
import { Loader } from "@components/Loader";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

function LayerControl({ position, children, setRefresh }) {
  const router = useRouter();
  const [storageSettings, setStorageSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );
  const { config } = useMapContext();
  const { subSelections: navSelections, name: area } = config;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [layers, setLayers] = useState([]);
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;
  const [groupedLayers, setGroupedLayers] = useState({});
  const [results, setResults] = useState([]); //search
  const [searching, setSearching] = useState(false);
  const [searchState, setSearchState] = useState("IDLE");

  const [hideCompleted, setHideCompleted] = useState(
    storageSettings[SETTING_HIDE_COMPLETED]
  );

  const toggle = (key) => {
    setStorageSettings((prev) => ({
      ...prev,
      hideCompletedMarkers: !hideCompleted,
    }));
    setHideCompleted(!hideCompleted);
    setRefresh(true);
  };

  const map = useMapEvents({
    layerremove: () => {
      // console.log("layer removed");
    },
    layeradd: () => {
      // console.log("layer add");
    },
  });

  const onLayerClick = (layerObj) => {
    if (map?.hasLayer(layerObj.layer)) {
      map.removeLayer(layerObj.layer);
      setLayers(
        layers.map((layer) => {
          if (layer.id === layerObj.id)
            return {
              ...layer,
              checked: false,
            };
          return layer;
        })
      );
    } else {
      map.addLayer(layerObj.layer);
      setLayers(
        layers.map((layer) => {
          if (layer.id === layerObj.id)
            return {
              ...layer,
              checked: true,
            };
          return layer;
        })
      );
    }
  };

  const onGroupAdd = (layer, name, group) => {
    setLayers((_layers) => [
      ..._layers,
      {
        layer,
        group,
        name,
        checked: map?.hasLayer(layer),
        id: Util.stamp(layer),
      },
    ]);
  };

  const handleHideShowAll = (val) => {
    const hiddenState = storageSettings[SETTING_HIDDEN_CATEGORY];

    for (const [key, value] of Object.entries(hiddenState)) {
      hiddenState[key] = val;
    }

    setStorageSettings((prev) => ({
      ...prev,
      [SETTING_HIDDEN_CATEGORY]: {
        ...hiddenState,
      },
    }));
    setRefresh(true);
  };

  useEffect(() => {
    if (Object.keys(groupedLayers).length === 0) {
      const seen = new Set();
      const data = {};
      layers.map((layer) => {
        const { group, name } = layer;
        if (!seen.has(name)) {
          if (data[group]) {
            data[group].push(layer);
          } else {
            data[group] = [layer];
          }
          seen.add(name);
        }
      });
      setGroupedLayers({ ...data });
    }
  }, [layers]);

  if (!groupedLayers) {
    return null;
  }

  const navigateToArea = (selection) => {
    const { to } = selection;

    if (!map) return;

    if (to === area) {
      map.flyTo(selection.location, selection.zoom, {
        animate: true,
        duration: 0.5,
      });
    } else {
      router.push(`/map/${to}`);
    }
  };

  return (
    <LayersControlProvider
      value={{
        layers,
        addGroup: onGroupAdd,
      }}
    >
      <div className={positionClass}>
        <div className="leaflet-control leaflet-bar" style={{ margin: 0 }}>
          {!sidebarOpen && (
            <>
              <Box
                onClick={() => setSidebarOpen(!sidebarOpen)}
                bg="#221c0f"
                px={2}
                py={3}
                mt={4}
                _hover={{ cursor: "pointer", border: "1px solid #fbe4bd" }}
              >
                &lt;
              </Box>
            </>
          )}
          <Drawer
            variant="aside"
            isOpen={sidebarOpen}
            placement="right"
            colorScheme="sidebar.content"
            onClose={() => setSidebarOpen(false)}
            closeOnOverlayClick={false}
            trapFocus={false}
            blockScrollOnMount={false}
            size="xs"
          >
            <DrawerContent>
              <DrawerHeader
                textAlign="center"
                _hover={{ cursor: "pointer" }}
                px={2}
              >
                <HStack>
                  <Link href={`/game/totk`}>
                    <Image
                      width={360}
                      height={60}
                      src={`/images/logos/totk/logo.png`}
                      alt="logo"
                      style={{ objectFit: "contain", height: "auto" }}
                      priority={true}
                    />
                  </Link>
                  <Box
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    _hover={{
                      cursor: "pointer",
                    }}
                    px={2}
                  >
                    X
                  </Box>
                </HStack>
              </DrawerHeader>
              <DrawerBody px="0" pb="0">
                <VStack>
                  <HStack>
                    <Button
                      onClick={() => handleHideShowAll(false)}
                      variant="underlined"
                      fontSize="xs"
                    >
                      Show All
                    </Button>
                    <Button
                      onClick={() => handleHideShowAll(true)}
                      variant="underlined"
                      fontSize="xs"
                    >
                      Hide All
                    </Button>
                  </HStack>
                  <Button
                    onClick={() => toggle(SETTING_HIDE_COMPLETED)}
                    variant="underlined"
                    fontSize="12px"
                  >
                    {hideCompleted ? "Show Completed" : "Hide Completed"}
                  </Button>
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
                  <Box mt={5} w="full" px={4}>
                    <SearchInput
                      setResults={setResults}
                      setSearching={setSearching}
                      setSearchState={setSearchState}
                    />
                  </Box>

                  <Box w="full" p={3} pb={0}>
                    {searching && <Loader loading={searching} />}
                    {searchState === "NO RESULT" && (
                      <Box textAlign="center">No Results Found</Box>
                    )}
                    {searchState === "COMPLETE" && (
                      <SearchResults results={results} />
                    )}
                    {searchState === "IDLE" && (
                      <Box w="full">
                        {Object.keys(groupedLayers).map((section, index) => (
                          <React.Fragment key={`${section} ${index}`}>
                            <GroupContainer
                              layerSection={groupedLayers[section]}
                              section={section}
                              onLayerClick={onLayerClick}
                            />
                          </React.Fragment>
                        ))}
                      </Box>
                    )}
                  </Box>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
        {children}
      </div>
    </LayersControlProvider>
  );
}

const GroupedLayer = createControlledLayer(function addGroup(
  layersControl,
  layer,
  name,
  group
) {
  layersControl.addGroup(layer, name, group);
});

export default LayerControl;
export { GroupedLayer };
