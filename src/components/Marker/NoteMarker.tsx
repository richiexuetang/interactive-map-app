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

const RMPopup = dynamic(() => import("@components/Popup/RMPopup"), {
  ssr: false,
});

const NoteMarker = ({ position, setRefresh }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dragRef = useRef(null);

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
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          {!marker && (
            <ModalContent>
              <ModalBody>
                <div>loading...</div>
              </ModalBody>
            </ModalContent>
          )}
          {marker && (
            <ModalContent>
              <ModalHeader>Create marker</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <RMForm />
                <Box paddingInline="1rem" border="1px solid" h="400px">
                  {/* <RichEditor
                           editorState={editorState}
                           setEditorState={setEditorState}
                         /> */}
                </Box>
              </ModalBody>

              <ModalFooter>
                <Box display="flex">
                  <Button type="submit">Submit</Button>
                  <Button onClick={onClose}>Cancel</Button>
                </Box>
              </ModalFooter>
            </ModalContent>
          )}
        </Modal>
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
