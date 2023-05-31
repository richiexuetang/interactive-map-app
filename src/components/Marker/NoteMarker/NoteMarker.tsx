import React, {useRef, useState} from "react";
import {Icon} from "leaflet";
import {Marker, Popup} from "react-leaflet";
import {Box, useDisclosure, Text, Button} from "@chakra-ui/react";
import {EditIcon} from "@chakra-ui/icons";

import CreateMarker from "@components/Modal/CreateMarker";
import {CustomPopup} from "src/styles/Popup.styles";

const NoteMarker = ({position, setRefresh}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const dragRef = useRef(null);
    
    const [lat, setLat] = useState<number>(position[0]);
    const [lng, setLng] = useState<number>(position[1]);

    const getNewPos = () => {
        const marker = dragRef.current;
        if (marker !== null) {
            const newPos = {...marker.getLatLng()};
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
                    iconAnchor: [17, 45]
                })
            }
        >
            {isOpen && (
                <CreateMarker
                    coordX={lat}
                    coordY={lng}
                    setRefresh={setRefresh}
                    isOpen={isOpen}
                    onClose={onClose}
                />
            )}
            {!isOpen && (
                <CustomPopup>
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
                            <EditIcon mx="5px" _hover={{cursor: "pointer"}} onClick={onOpen} />
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
                </CustomPopup>
            )}
        </Marker>
    );
};

export default NoteMarker;
