import React from "react";

import {Box} from "@chakra-ui/react";
import {EditIcon} from "@chakra-ui/icons";

import { useMapContext } from "@context/app-context";

const AddMarkerControl = ({useMap}) => {
    const map = useMap();
    const {noteMarkers, setNoteMarkers} = useMapContext();

    const handleEditToggle = () => {
        const center = map.getCenter();
        setNoteMarkers([...noteMarkers, [center.lat, center.lng]]);
    };

    return (
        <Box className="leaflet-top leaflet-right" mt="90px">
            <Box className="leaflet-control leaflet-bar" bg="app.text">
                <EditIcon
                    minW="30px !important"
                    w="30px"
                    h="30px"
                    p="0"
                    color="app.background"
                    onClick={handleEditToggle}
                    _hover={{cursor: "pointer", color: "app.modal"}}
                />
            </Box>
        </Box>
    );
};

export default AddMarkerControl;
