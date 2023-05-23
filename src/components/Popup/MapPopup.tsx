import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { LinkIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  Divider,
  HStack,
  Stack,
  Text,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

import MarkerEdit from "@components/Modal/EditMarker";
import { useMapContext } from "@context/app-context";
import { COMPLETED } from "@data/LocalStorage";
import useCopyToClipboard from "@hooks/useCopyToClipboard";
import { categoryDescriptions } from "@data/categoryDescription";
import useMapObject from "@hooks/useMapObject";

const MapPopup = ({
  Popup,
  title,
  type,
  descriptions,
  id,
  setCompleted,
  completed,
  category,
}) => {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { game } = useMapContext();

  const helperDescriptions = categoryDescriptions.filter(
    (item) => item.gameSlug === game
  )[0].categoryDescriptions;
  const [categoryDescription] = useMapObject(helperDescriptions);

  const [helperDesc] = useState(categoryDescription.get(category));
  const { setMarkers, markers } = useMapContext();
  const [value, copy] = useCopyToClipboard();

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
    copy(`${process.env.BASE_URL}${pathname}?markerId=${id}`);
    toast.success(`Link copied`);
  };

  if (isOpen) {
    return (
      <MarkerEdit
        onClose={onClose}
        isOpen={isOpen}
        markerInfo={{ id: id, descriptions: descriptions, title: title }}
      />
    );
  }

  const handleDelete = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/deleteMarker?id=` + id,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );

      setMarkers(markers.filter((marker) => marker._id !== id));

      toast.success("Delete Successful");
    } catch (errorMessage: any) {
      toast.error(errorMessage);
    }
  };

  return (
    <Popup>
      <HStack justifyContent="space-between" mb={2}>
        <Stack mt={3} spacing="3">
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
            <DeleteIcon
              mx="5px"
              _hover={{ cursor: "pointer" }}
              onClick={handleDelete}
            />
          </Text>
          <Text mr="10px !important" mt="0 !important" fontSize="11px">
            {type}
          </Text>
          {descriptions &&
            descriptions.map((desc, i) => (
              <div key={i} dangerouslySetInnerHTML={{ __html: desc }} />
            ))}
          {helperDesc && (
            <chakra.p
            mb='1em'
              fontSize="90%"
              fontStyle="italic"
              opacity="0.8"
            >
              {helperDesc}
            </chakra.p>
          )}
        </Stack>
      </HStack>

      <Divider />
      <Box my={4} textAlign="center" pl={3}>
        <Checkbox isChecked={completed} onChange={handleCompleteCheck}>
          Completed
        </Checkbox>
      </Box>
    </Popup>
  );
};

export default MapPopup;
