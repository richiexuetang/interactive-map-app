import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { DeleteIcon, EditIcon, LinkIcon } from "@chakra-ui/icons";
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
import { useCopyToClipboard, useLocalStorage } from "@hooks/index";

const MapPopup = ({
  Popup,
  setCompleted,
  markerInfo,
  fetchInfo,
  setFetchInfo,
}) => {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status } = useSession();
  const [completedMarkers, setCompletedMarkers] = useLocalStorage(
    COMPLETED,
    {}
  );

  const { setMarkers, markers, markerRefs } = useMapContext();
  const [value, copy] = useCopyToClipboard();
  const [completed] = useState(completedMarkers[markerInfo.id]);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (fetchInfo) {
      markerRefs[markerInfo.id].openPopup();
      fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/marker-detail?id=` +
          markerInfo.id,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((json) => setDetails({ ...json }));
    }
  }, [fetchInfo]);

  const handleCompleteCheck = (e) => {
    setCompleted(e.target.checked);

    setCompletedMarkers((prev) => ({
      ...prev,
      [markerInfo.id]: e.target.checked,
    }));
  };

  const handleCopyLink = () => {
    copy(`${process.env.BASE_URL}${pathname}?markerId=${markerInfo.id}`);
    toast.success(`Link copied`);
  };

  if (isOpen) {
    return (
      <MarkerEdit
        onClose={onClose}
        isOpen={isOpen}
        markerInfo={{
          id: markerInfo.id,
          descriptions: markerInfo.descriptions,
          title: markerInfo.title,
          category: markerInfo.category,
        }}
      />
    );
  }

  const handleDelete = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/deleteMarker?id=` +
          markerInfo.id,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );

      setMarkers(markers.filter((marker) => marker._id !== markerInfo.id));
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
            fontSize="1rem"
            fontWeight="normal"
            lineHeight="1.2"
            mb="5px !important"
            mt="0 !important"
            display="flex"
            alignItems="center"
          >
            {markerInfo.title}
            <LinkIcon
              mx="5px"
              _hover={{ cursor: "pointer" }}
              onClick={handleCopyLink}
            />
            {status === "authenticated" && (
              <>
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
              </>
            )}
          </Text>
          <Text mr="10px !important" mt="0 !important" fontSize="11px">
            {details && details.type}
          </Text>
          {details &&
            details.descriptions &&
            details.descriptions.map((desc, i) => (
              <div key={i} dangerouslySetInnerHTML={{ __html: desc }} />
            ))}
        </Stack>
      </HStack>

      <Divider />
      <Box my={4} textAlign="center" pl={3}>
        <Checkbox
          isChecked={completed}
          onChange={(e) => handleCompleteCheck(e)}
        >
          Completed
        </Checkbox>
      </Box>
    </Popup>
  );
};

export default MapPopup;
