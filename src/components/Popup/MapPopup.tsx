import React from "react";

import { LinkIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  Divider,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

import MarkerEdit from "@components/Modal/EditMarker";
import { useMapContext } from "@context/app-context";
import { COMPLETED } from "@data/LocalStorage";
import useCopyToClipboard from "@hooks/useCopyToClipboard";

const MapPopup = ({
  Popup,
  title,
  type,
  descriptions,
  id,
  setCompleted,
  completed,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [value, copy] = useCopyToClipboard();
  const { area } = useMapContext();

  const handleCompleteCheck = () => {
    setCompleted(!completed);
    const json = JSON.parse(window.localStorage.getItem(COMPLETED));

    let newJson = { ...json, [id]: true };

    if (completed) {
      delete newJson[id];
    }

    window.localStorage.setItem(COMPLETED, JSON.stringify(newJson));
  };

  const handleCopyLink = () => {
    copy(`${process.env.REACT_APP_URL}/${area}?markerId=${id}`);
    toast.success(`Link copied ${value}`);
  };

  if (isOpen) {
    return (
      <MarkerEdit
        onClose={onClose}
        isOpen={isOpen}
        markerInfo={{id: id, descriptions: descriptions}}
      />
    );
  }

  return (
    <Popup>
      <HStack justifyContent="space-between">
        <Stack mt="3" spacing="3">
          <Text
            fontSize="1.25rem"
            fontWeight="normal"
            lineHeight="1.2"
            mb="5px !important"
            mt="0 !important"
            display="flex"
          >
            {title}
            <LinkIcon
              mx="5px"
              _hover={{ cursor: "pointer" }}
              onClick={handleCopyLink}
            />
            <EditIcon
              mx="5px"
              _hover={{ cursor: "pointer" }}
              onClick={onOpen}
            />
          </Text>
          <Text
            mr="10px !important"
            mt="0 !important"
            fontSize="11px"
          >
            {type}
          </Text>
          {descriptions &&
            descriptions.map((desc) => (
              <div dangerouslySetInnerHTML={{ __html: desc }} />
            ))}
        </Stack>
      </HStack>
      <Divider />
      <Box my={8} textAlign="center" pl={3}>
        <Checkbox isChecked={completed} onChange={handleCompleteCheck}>
          Completed
        </Checkbox>
      </Box>
    </Popup>
  );
};

export default MapPopup;
