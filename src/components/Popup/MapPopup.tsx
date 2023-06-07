import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

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

// import MarkerEdit from "@components/Modal/EditMarker";
import { COMPLETED } from "@data/LocalStorage";
import { useCopyToClipboard, useLocalStorage } from "@hooks/index";
import dynamic from "next/dynamic";
import { useMapContext } from "@context/app-context";

const RMPopup = dynamic(() => import("@components/Popup/RMPopup"), {
  ssr: false,
});

const RMTooltip = dynamic(() => import("@components/Popup/RMTooltip"), {
  ssr: false,
});

const MapPopup = ({ markerInfo }) => {
  const { setStandardMarker, standardMarker } = useMapContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status } = useSession();
  const pathname = usePathname();
  const [completedMarkers, setCompletedMarkers] = useLocalStorage(
    COMPLETED,
    {}
  );

  const [value, copy] = useCopyToClipboard();
  const [completed] = useState(completedMarkers[markerInfo.id]);

  const handleCompleteCheck = (e) => {
    setCompletedMarkers((prev) => ({
      ...prev,
      [markerInfo.id]: e.target.checked,
    }));
  };

  const handleCopyLink = () => {
    copy(`${process.env.BASE_URL}${pathname}?markerId=${markerInfo.id}`);
    toast.success(`Link copied`);
  };

  // if (isOpen) {
  //   return (
  //     <MarkerEdit
  //       onClose={onClose}
  //       isOpen={isOpen}
  //       markerInfo={{
  //         id: markerInfo.id,
  //         descriptions: markerInfo.descriptions,
  //         title: markerInfo.title,
  //         category: markerInfo.category,
  //       }}
  //     />
  //   );
  // }

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

      setStandardMarker(
        standardMarker.filter((marker) => marker.id !== markerInfo.id)
      );
      toast.success("Delete Successfully");
    } catch (errorMessage: any) {
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <RMPopup>
        <HStack justifyContent="space-between" mb={2}>
          <Stack mt={2} spacing="3">
            <Text
              fontSize="1.25rem"
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
            </Text>

            {markerInfo &&
              markerInfo.descriptions &&
              markerInfo.descriptions.map((desc, i) => (
                <div
                  key={i}
                  style={{ margin: "0.25em" }}
                  dangerouslySetInnerHTML={{ __html: desc }}
                />
              ))}
          </Stack>
        </HStack>

        <Divider pt={2} />
        <Box my={2} textAlign="center" pl={3}>
          <Checkbox
            isChecked={completed}
            onChange={(e) => handleCompleteCheck(e)}
          >
            <Text letterSpacing={0}>Completed</Text>
          </Checkbox>
        </Box>
      </RMPopup>
      <RMTooltip>{markerInfo.title}</RMTooltip>
    </>
  );
};

export default MapPopup;
