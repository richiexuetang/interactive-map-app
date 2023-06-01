import React, { useEffect, useState } from "react";
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
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Select,
} from "@chakra-ui/react";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { toast } from "react-toastify";

import dynamic from "next/dynamic";
import { MarkerInfo } from "src/types/markerInfo";
import { marker } from "leaflet";
import useMapObject from "@hooks/useMapObject";
import { categoryItemsConfig } from "@data/index";
import { useMapContext } from "@context/app-context";

const RichEditor = dynamic(() => import("../Editor/RichEditor"), {
  ssr: false,
});

interface MarkerEditPropsType {
  markerInfo: MarkerInfo;
  onClose: any;
  isOpen: boolean;
}

const MarkerEdit: React.FC<MarkerEditPropsType> = ({
  markerInfo,
  onClose,
  isOpen,
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const { id, descriptions, title: initialTitle, category } = markerInfo;
  const { game } = useMapContext();

  const [markerCategory, markerCategoryActions] = useMapObject<string, string>(
    []
  );
  const [desc, setDesc] = useState<string[]>([...descriptions]);
  const [title, setTitle] = useState(initialTitle);
  const [categoryTypeMap, setCategoryTypeMap] = useState({});
  const [marker, setMarker] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(category);

  useEffect(() => {
    if (!markerCategory.size) {
      categoryItemsConfig.map((entry) => {
        if (entry.gameSlug === game) {
          entry.categoryGroups.map(({ members }) => {
            Array.from(members.entries()).map(([key, value]) => {
              const [category, type] = [...value];
              markerCategoryActions.set(category, type);

              setCategoryTypeMap((prevState) => {
                return Object.assign({}, prevState, { [category]: type });
              });
            });
          });
        }
      });
    }
  }, [markerCategory]);

  const handleEditMarker = async () => {
    const newDesc = [...desc];

    if (editorState.getCurrentContent().hasText()) {
      const rawRichText = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );

      setEditorState(
        EditorState.createWithContent(editorState.getCurrentContent())
      );
      newDesc.push(rawRichText);
    }

    setDesc([...newDesc]);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/editMarker?id=` + id,
        {
          method: "POST",
          body: JSON.stringify({
            title,
            descriptions: newDesc,
            category: selectedCategory,
            type: categoryTypeMap[selectedCategory]
          }),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Marker update success");
    } catch (errorMessage: any) {
      toast.error(errorMessage);
    }
  };

  const handleDescriptionChange = (e, i) => {
    const newDesc = [...desc];
    newDesc[i] = e.target.value;
    setDesc([...newDesc]);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setMarker((prevState) => {
      return Object.assign({}, prevState, {
        category: e.target.value,
        type: categoryTypeMap[e.target.value],
      });
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit marker</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel mt={5}>Title:</FormLabel>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <FormLabel mt={5}>Category:</FormLabel>
            <Select
              id="category"
              value={selectedCategory}
              placeholder="Select the category from dropdown"
              onChange={(e) => handleCategoryChange(e)}
            >
              {Array.from(markerCategory.entries()).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>

            <FormLabel mt={5}>Descriptions:</FormLabel>
            {desc &&
              desc.map((value, i) => (
                <Textarea
                  id={i.toString()}
                  key={i}
                  value={desc[i]}
                  onChange={(e) => handleDescriptionChange(e, i)}
                />
              ))}
          </FormControl>
          <Box border="1px solid" h="100%">
            <RichEditor
              editorState={editorState}
              setEditorState={setEditorState}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleEditMarker} type="submit" mr={4}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MarkerEdit;
