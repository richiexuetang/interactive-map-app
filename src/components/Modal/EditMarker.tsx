import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
} from "@chakra-ui/react";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";
import { toast } from "react-toastify";

import axios from "axios";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("../Editor/RichEditor"), {
  ssr: false,
});

const MarkerEdit = ({ id, descriptions, onClose, isOpen }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [desc, setDesc] = useState(descriptions);

  const handleEditMarker = async () => {
    let newData = { ...desc };

    if (editorState.getCurrentContent().hasText()) {
      const rawRichText = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );

      newData = [...desc, rawRichText];
    }

    setDesc(newData);

    const { data } = await axios.put(
      `https://maps-server.onrender.com/api/marker/${id}`,
      {
        descriptions: [...newData],
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (data.success) {
        toast.success("Marker description added");
    } else {
        toast.error("Something went wrong")
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit marker</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box paddingInline="1rem" border="1px solid" h="400px">
            <RichEditor
              editorState={editorState}
              setEditorState={setEditorState}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleEditMarker} type="submit">
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MarkerEdit;
