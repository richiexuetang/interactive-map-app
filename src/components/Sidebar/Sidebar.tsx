import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  IconButton,
  Box,
  DrawerHeader,
  Image as ChakraImage,
} from "@chakra-ui/react";
import Content from "./Content/Content";
import Link from "next/link";

const Sidebar = ({
  markerRefs,
  game,
  categoryGroups,
  navSelections,
  area,
  categoryCounts,
  useMap,
  markers,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      {!sidebarOpen && (
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
        placement="left"
        colorScheme="sidebar.content"
        onClose={() => setSidebarOpen(false)}
        closeOnOverlayClick={false}
        trapFocus={false}
        blockScrollOnMount={false}
        size={"xs"}
      >
        <DrawerContent>
          <Box bg="#221c0f" position="absolute" left="100%" top="8px">
            <IconButton
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
          <DrawerHeader textAlign="center">
            <Link href="/">
              <ChakraImage
                src={`/images/logos/${game}/logo.png`}
                alt="logo"
                _hover={{ cursor: "pointer" }}
              />
            </Link>
          </DrawerHeader>
          <DrawerBody px="0" pb="0">
            <Content
              markerRefs={markerRefs}
              game={game}
              categoryGroups={categoryGroups}
              navSelections={navSelections}
              area={area}
              categoryCounts={categoryCounts}
              useMap={useMap}
              markers={markers}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
