import React, { useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";
import { Util } from "leaflet";
import { LayersControlProvider } from "@context/layer-control-context";
import createControlledLayer from "./controlledLayer";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  IconButton as CIconButton,
  VStack,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useMapContext } from "@context/app-context";
import { CategoryGroup, SearchInput, SearchResults } from "@components/Sidebar";
import {
  SETTING_HIDE_ALL,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import { useRouter } from "next/router";
import useLocalStorage from "@hooks/useLocalStorage";

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
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.bottomleft;
  const [groupedLayers, setGroupedLayers] = useState({});
  const [results, setResults] = useState([]);

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
    // click: (e) => {
    //   var pixelPosition = e.layerPoint;
    //   var latLng = map.layerPointToLatLng(pixelPosition);
    //   console.log("" + latLng.lat + "," + latLng.lng);
    // },
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
    setStorageSettings((prev) => ({
      ...prev,
      [SETTING_HIDE_ALL]: val,
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

    if (!map) {
      return;
    }

    // console.log("" + map.getCenter().lat + "," + map.getCenter().lng);
    // console.log(map.getZoom());
    // console.log(map.getBounds())

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
        <div className="leaflet-control leaflet-bar">
          {!sidebarOpen && (
            <>
              <CIconButton
                icon={
                  sidebarOpen ? (
                    <ChevronRightIcon w="23px" h="48px" />
                  ) : (
                    <ChevronLeftIcon w="23px" h="48px" />
                  )
                }
                zIndex="1000"
                float="right"
                right={2}
                top="8px"
                bg="#221c0f"
                pos="absolute"
                colorScheme="sidebarArrow"
                variant="outline"
                cursor="pointer"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="sidebar-button"
              />
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
              <DrawerCloseButton />
              <Box bg="#221c0f" position="absolute" left="100%" top="8px">
                <CIconButton
                  icon={
                    sidebarOpen ? (
                      <ChevronLeftIcon w="23px" h="48px" />
                    ) : (
                      <ChevronRightIcon w="23px" h="48px" />
                    )
                  }
                  top="8px"
                  bg="#221c0f"
                  pos="absolute"
                  colorScheme="sidebar.arrow"
                  variant="outline"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label="sidebar-button"
                />
              </Box>
              <DrawerHeader textAlign="center" _hover={{ cursor: "pointer" }}>
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
                  <Box mt={5}>
                    <SearchInput setResults={setResults} />
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

                  <Box w="full" p={3} pb={0}>
                    {results && results.length ? (
                      <SearchResults results={results} />
                    ) : (
                      <Box w="full">
                        {Object.keys(groupedLayers).map((section, index) => (
                          <React.Fragment key={`${section} ${index}`}>
                            <Box textTransform="uppercase" py={3}>
                              {section}
                            </Box>
                            {groupedLayers[section]?.map((layerObj) => (
                              <CategoryGroup
                                key={`${section} ${layerObj.name}`}
                                onLayerClick={onLayerClick}
                                layerObj={layerObj}
                              />
                            ))}
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
