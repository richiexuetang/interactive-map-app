import React, { useRef, useState } from "react";
import { Icon, marker } from "leaflet";
import { Marker } from "react-leaflet";
import {
  Box,
  useDisclosure,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

import dynamic from "next/dynamic";
import RMForm from "@components/Form/RMForm";
import { useMapContext } from "@context/app-context";
import { toast } from "react-toastify";

const RMPopup = dynamic(() => import("@components/Popup/RMPopup"), {
  ssr: false,
});

const NoteMarker = ({ position, setRefresh }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dragRef = useRef(null);
  const { config } = useMapContext();

  const [lat, setLat] = useState<number>(position[0]);
  const [lng, setLng] = useState<number>(position[1]);

  const getNewPos = () => {
    const marker = dragRef.current;
    if (marker !== null) {
      const newPos = { ...marker.getLatLng() };
      setLat(newPos.lat);
      setLng(newPos.lng);
    }
  };

  const onCreateSubmit = async (values) => {
    const { markerName, categoryId, descriptions, markerType } = values;
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/addMarker`,
        {
          method: "POST",
          body: JSON.stringify({
            markerName,
            categoryId,
            descriptions,
            mapSlug: config.name,
            gameSlug: config.gameSlug,
            markerTypeId: markerType,
            lat: position[0],
            lng: position[1],
            coordinate: [lat, lng],
          }),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );
      const { insertedId } = await response.json();
      toast.success("Marker Created Successfully");
    } catch (errorMessage: any) {
      toast.error(errorMessage);
    }
  };
  return (
    <Marker
      key={lat}
      ref={dragRef}
      position={[lat, lng]}
      draggable={true}
      icon={
        new Icon({
          iconUrl: `/images/icons/waypoint.png`,
          iconSize: [35, 45],
          iconAnchor: [17, 45],
        })
      }
    >
      {isOpen && (
        <RMForm
          onSubmit={onCreateSubmit}
          onClose={onClose}
          isOpen={isOpen}
          markerInfo={{ lat: position[0], lng: position[1] }}
        />
      )}
      {!isOpen && (
        <RMPopup>
          <Box>
            <Box
              fontSize="1.25rem"
              fontWeight="normal"
              lineHeight="1.2"
              mb="5px !important"
              mt="0 !important"
              display="flex"
            >
              <Text fontSize="15px">Current Latitude: {lat.toFixed(10)}</Text>
              <Text fontSize="15px">Current Longitude: {lng.toFixed(10)}</Text>
              <EditIcon
                mx="5px"
                _hover={{ cursor: "pointer" }}
                onClick={onOpen}
              />
            </Box>
            <Box m="5px -10px 0" overflow="hidden" textAlign="center" pb="10px">
              <Box
                pr="1.5rem"
                pl="0"
                fontSize="16px"
                lineHeight="27px"
                cursor="pointer"
                borderTop="1px solid #584835"
                padding="7px"
              >
                <Button variant="underlined" onClick={getNewPos}>
                  Get Position
                </Button>
              </Box>
            </Box>
          </Box>
        </RMPopup>
      )}
    </Marker>
  );
};

export default NoteMarker;
