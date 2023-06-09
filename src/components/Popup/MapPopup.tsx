import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { EditIcon, LinkIcon } from "@chakra-ui/icons";
import { Box, Checkbox, Divider, HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
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
  const {onOpen, isOpen, onClose} = useDisclosure()
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
      [markerId]: e.target.checked,
    }));
    setCompleted(e.target.checked);
  };

  const handleCopyLink = () => {
    copy(`${process.env.BASE_URL}${pathname}?markerId=${markerId}`);
    toast.success(`Link copied`);
  };

  const onEditSubmit = () => {

  }

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
        markerInfo={{
          id: markerId,
          lat: markerInfo.lat,
          lng: markerInfo.lng,
          markerName: markerInfo.markerName,
          descriptions: markerInfo.descriptions,
          markerTypeId: markerInfo.markerTypeId,
          categoryId: markerInfo.categoryId
        }}
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
              </Text>
              <Text>
                {markerInfo && categoryIdNameMap[markerInfo.categoryId]}
              </Text>

              {markerInfo?.descriptions &&
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
              <Text letterSpacing={0} mb="0 !important">
                Completed
              </Text>
            </Checkbox>
          </Box>
        </>
      )}
      {loaded && markerInfo && <RMTooltip>{markerInfo.markerName}</RMTooltip>}
    </RMPopup>
  );
};

export default MapPopup;
