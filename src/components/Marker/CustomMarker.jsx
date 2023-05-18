import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { Box, HStack, Stack, Text, Checkbox, Divider } from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";

import useLocalStorage from "@hooks/useLocalStorage";
import {
  initialUserSettings,
  COMPLETED,
  SETTING_HIDDEN_CATEGORY,
  SETTING_HIDE_ALL,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
} from "@data/LocalStorage";
import { useMapContext } from "src/context/app-context";

const Marker = dynamic(() => import("./DynamicMarker"), {
  ssr: false,
});

const CustomMarker = (props) => {
  const {area} = useMapContext();
  const { marker, gameSlug, useMap, rank } = props;
  const { _id: id, category, title, type, descriptions } = marker;
  
  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings);
  const [completedMarkers] = useLocalStorage(COMPLETED, {});
  const [completed, setCompleted] = useState(completedMarkers[id]);

  const shouldHideInitial =
    (userSettings[SETTING_HIDE_COMPLETED][gameSlug] && completedMarkers[id]) ||
    userSettings[SETTING_HIDDEN_CATEGORY][gameSlug][category] ||
    userSettings[SETTING_HIDE_ALL][gameSlug];

  const [shouldHide, setShouldHide] = useState(shouldHideInitial);

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
    console.log("link");
  };

  return (
    <>
      {!shouldHide && (
        <Marker {...props} opacity={completed ? 0.5 : 1}>
          {({ Popup }) => {
            const CustomPopup = styled(Popup)`
              border-radius: 0;
              white-space: nowrap;
              min-width: 350px;
              max-width: 450px;
              white-space: initial;
              bottom: 45px !important;

              .leaflet-popup-content-wrapper {
                border-radius: 0;
                background: #221c0f;
                border: 0.2px solid #fbe4bd;
                color: #967959;
                overflow-wrap: hidden;
              }

              .leaflet-popup-content-wrapper::after {
                content: "";
                position: absolute;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: black transparent transparent transparent;
              }

              .leaflet-popup-tip {
                background: #221c0f;
              }

              .leaflet-popup-tip-container {
                background: transparent;
              }
            `;

            return (
              <CustomPopup>
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
                    </Text>
                    <Text
                      mr="10px !important"
                      mb="10px !important"
                      mt="0 !important"
                      fontSize="11px"
                    >
                      {type}
                    </Text>
                    {descriptions &&
                      descriptions.map((desc) => (
                        <Box fontWeight="500" key={desc} mb="2px">
                          <div dangerouslySetInnerHTML={{ __html: desc }} />
                        </Box>
                      ))}
                  </Stack>
                </HStack>
                <Divider />
                <Box my={8} textAlign="center" pl={3}>
                  <Checkbox
                    isChecked={completed}
                    onChange={handleCompleteCheck}
                  >
                    Completed
                  </Checkbox>
                </Box>
              </CustomPopup>
            );
          }}
        </Marker>
      )}
    </>
  );
};

export default CustomMarker;
