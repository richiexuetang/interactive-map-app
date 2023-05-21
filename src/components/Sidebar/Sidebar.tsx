import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  IconButton,
} from "@chakra-ui/react";

import { Content } from "./Content";
import { useMapContext } from "@context/app-context";

const Sidebar = ({ useMap }) => {
  const { game } = useMapContext();
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
          <DrawerHeader textAlign="center" _hover={{ cursor: "pointer" }}>
            <Link href={`/game/${game}`}>
              <Image
                width={360}
                height={60}
                src={`/images/logos/${game}/logo.png`}
                alt="logo"
                style={{ objectFit: "contain" }}
              />
            </Link>
          </DrawerHeader>
          <DrawerBody px="0" pb="0">
            <Content useMap={useMap} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
