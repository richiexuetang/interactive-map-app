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

import { COMPLETED } from "@data/LocalStorage";
import { useCopyToClipboard, useLocalStorage } from "@hooks/index";
import dynamic from "next/dynamic";
import { Loader } from "@components/Loader";
import { categoryIdNameMap } from "@data/categoryItemsConfig";
import RMForm from "@components/Form/RMForm";

const RMPopup = dynamic(() => import("@components/Popup/RMPopup"), {
  ssr: false,
});

const RMTooltip = dynamic(() => import("@components/Popup/RMTooltip"), {
  ssr: false,
});

const MapPopup = (props) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { markerInfo, markerId } = props;
  const pathname = usePathname();
  const [completedMarkers, setCompletedMarkers] = useLocalStorage(
    COMPLETED,
    {}
  );
  const [loaded, setLoaded] = useState(false);

  const [value, copy] = useCopyToClipboard();
  const [completed, setCompleted] = useState(completedMarkers[markerId]);

  const handleCompleteCheck = (e) => {
    setCompletedMarkers((prev) => ({
      ...prev,
      [markerId]: e.target.checked ? markerInfo.categoryId : null,
    }));
    setCompleted(e.target.checked);
  };

  const handleCopyLink = () => {
    copy(`${process.env.BASE_URL}${pathname}?markerId=${markerId}`);
    toast.success(`Link copied`);
  };

  const onEditSubmit = async (values) => {
    const {
      markerName: newName,
      lat: newLat,
      lng: newLng,
      description,
      categoryId,
      markerType,
    } = values;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/editMarker?id=` + markerId,
        {
          method: "POST",
          body: JSON.stringify({
            markerName: newName,
            lat: newLat,
            lng: newLng,
            description: description,
            categoryId: categoryId,
            markerTypeId: markerType,
          }),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();

      toast.success("Marker update success");
    } catch (errorMessage: any) {
      toast.error(errorMessage);
    }
  };

  const onDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/deleteMarker?id=` + markerId,
        {
          method: "POST",
          body: JSON.stringify({
            id: markerId,
          }),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();

      toast.success("Marker delete success");
    } catch (errorMessage: any) {
      toast.error(errorMessage);
    }
  };
  useEffect(() => {
    if (markerInfo) {
      setLoaded(true);
    }
  }, [markerInfo]);

  if (isOpen) {
    return (
      <RMForm
        onClose={onClose}
        isOpen={isOpen}
        markerInfo={markerInfo}
        onSubmit={onEditSubmit}
      />
    );
  }

  return (
    <RMPopup>
      {!loaded ? (
        <Loader loading={!loaded} />
      ) : (
        <>
          <HStack justifyContent="space-between" mb={2}>
            <Stack mt={2} spacing="3">
              <Text
                fontSize="1.25rem"
                mb="5px !important"
                mt="0 !important"
                display="flex"
                alignItems="center"
              >
                {markerInfo && markerInfo.markerName}
                <LinkIcon
                  ml={3}
                  _hover={{ cursor: "pointer" }}
                  onClick={handleCopyLink}
                />
                <EditIcon
                  ml={3}
                  _hover={{ cursor: "pointer" }}
                  onClick={onOpen}
                />
                <DeleteIcon
                  ml={3}
                  _hover={{ cursor: "pointer" }}
                  onClick={onDelete}
                />
              </Text>
              <Text>
                {markerInfo && categoryIdNameMap[markerInfo.categoryId]}
              </Text>

              {markerInfo.description && (
                <div
                  key={markerId}
                  style={{ margin: "0.25em", color: "#fbe4bd" }}
                  dangerouslySetInnerHTML={{ __html: markerInfo.description }}
                />
              )}
            </Stack>
          </HStack>

          <Divider pt={2} />
          <Box
            textAlign="center"
            _hover={{ cursor: "pointer", bg: "whiteAlpha.300" }}
          >
            <Checkbox
              py={2}
              isChecked={completed}
              spacing={2}
              onChange={(e) => handleCompleteCheck(e)}
            >
              Completed
            </Checkbox>
          </Box>
        </>
      )}
      {loaded && markerInfo && <RMTooltip>{markerInfo.markerName}</RMTooltip>}
    </RMPopup>
  );
};

export default MapPopup;
