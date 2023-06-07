import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Box,
  ModalFooter,
  ModalContent,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Textarea,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";

import useMapObject from "@hooks/useMapObject";
import { RichEditor } from "@components/Editor";
import { categoryIdNameMap, categoryItemsConfig } from "@data/categoryItemsConfig";
import { useMapContext } from "@context/app-context";

interface Marker {
  mapSlug: string;
  categoryId: number;
  coordinate: number[];
  markerName: string;
  descriptions: string[];
}

const CreateMarker = ({ coordX, coordY, setRefresh, isOpen, onClose }) => {
  const { config, markers, setMarkers } = useMapContext();
  const [markerCategory, markerCategoryActions] = useMapObject<string, string>(
    []
  );
  const [categoryTypeMap, setCategoryTypeMap] = useState({});

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [marker, setMarker] = useState<Marker | null>(null);

  useEffect(() => {
    if (!markerCategory.size) {
      categoryItemsConfig.map((entry) => {
        if (entry.gameSlug === config.gameSlug) {
          entry.categoryGroups.map(({ members }) => {
            members.map((categoryId) => {
              const type = categoryIdNameMap[categoryId];
              setCategoryTypeMap((prevState) => {
                return Object.assign({}, prevState, { [categoryId]: type });
              });

            })
          });
        }
      });
    }
  }, [markerCategory]);

  useEffect(() => {
    if (!marker && categoryTypeMap && categoryTypeMap["seed"]) {
      const value = categoryTypeMap["seed"];
      setMarker({
        ...marker,
        mapSlug: config.name,
        categoryId: 69,
        markerName: value,
        coordinate: [coordX, coordY],
        descriptions: [],
      });
    }
  }, [categoryTypeMap]);

  const handleCategoryChange = (e) => {
    setMarker((prevState) => {
      return Object.assign({}, prevState, {
        category: e.target.value,
        type: categoryTypeMap[e.target.value],
      });
    });
  };

  const handleInputChange = (e) => {
    setMarker((prevState) => {
      return Object.assign({}, prevState, {
        title: e.target.value,
      });
    });
  };

  const handleDescriptionChange = (e, i) => {
    const newDesc = [...marker.descriptions];
    newDesc[i] = e.target.value;
    setMarker((prevState) => {
      return Object.assign({}, prevState, {
        descriptions: [...newDesc],
      });
    });
  };

  // const handleCreateMarker = async () => {
  //   setEditorState(
  //     EditorState.createWithContent(editorState.getCurrentContent())
  //   );

  //   if (editorState.getCurrentContent().hasText()) {
  //     const rawRichText = draftToHtml(
  //       convertToRaw(editorState.getCurrentContent())
  //     );

  //     setMarker((prevState) => {
  //       return Object.assign({}, prevState, {
  //         descriptions: [...prevState.descriptions, rawRichText],
  //       });
  //     });
  //   } else {
  //     setMarker((prevState) => {
  //       return Object.assign({}, prevState, {
  //         descriptions: [...prevState.descriptions],
  //       });
  //     });
  //   }

  //   const { markerName, categoryId, descriptions, mapSlug, coordinate} = marker;

  //   try {
  //     let response = await fetch(
  //       `${process.env.NEXT_PUBLIC_APP_URL}/api/addMarker`,
  //       {
  //         method: "POST",
  //         body: JSON.stringify({
  //           title,
  //           category,
  //           descriptions,
  //           area,
  //           coord,
  //           type,
  //         }),
  //         headers: {
  //           Accept: "application/json, text/plain, */*",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     const { insertedId } = await response.json();

  //     setMarkers((prevState) => [
  //       ...prevState,
  //       {
  //         _id: insertedId,
  //         title: title,
  //         category: category,
  //         descriptions: descriptions,
  //         area: area,
  //         coord: coord,
  //         type: type,
  //       },
  //     ]);
  //     toast.success("Marker Created Successfully");
  //   } catch (errorMessage: any) {
  //     toast.error(errorMessage);
  //   }
  // };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      {!marker && (
        <ModalContent>
          <ModalBody>
            <div>loading...</div>
          </ModalBody>
        </ModalContent>
      )}
      {marker && (
        <ModalContent>
          <ModalHeader>Create marker</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Area:</FormLabel>
              <Input id="area" value={config.name} disabled />

              {/* <FormLabel mt={5}>Category:</FormLabel>
              <Select
                id="category"
                value={marker.category}
                placeholder="Select the category from dropdown"
                onChange={(e) => handleCategoryChange(e)}
              >
                {Array.from(markerCategory.entries()).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select> */}

              <FormLabel mt={5}>Title:</FormLabel>
              <Input
                id="title"
                type="text"
                value={marker.markerName}
                onChange={(e) => handleInputChange(e)}
              />

              <Box display="flex" justifyContent="space-between" mt={5}>
                <Box display="flex">
                  <FormLabel mt={5}>Lat:</FormLabel>
                  <Input id="lat" value={marker.coordinate[0]} disabled />
                </Box>
                <Box display="flex" ml="2px">
                  <FormLabel mt={5}>Long:</FormLabel>
                  <Input id="long" value={marker.coordinate[1]} disabled />
                </Box>
              </Box>

              <FormLabel mt={5}>Description:</FormLabel>
              {marker.descriptions.map((value, i) => (
                <Textarea
                  id={i.toString()}
                  key={i}
                  value={value}
                  onChange={(e) => handleDescriptionChange(e, i)}
                />
              ))}
            </FormControl>
            <Box paddingInline="1rem" border="1px solid" h="400px">
              <RichEditor
                editorState={editorState}
                setEditorState={setEditorState}
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Box display="flex">
              {/* <Button onClick={handleCreateMarker} type="submit">
                Submit
              </Button> */}
              <Button onClick={onClose}>Cancel</Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default CreateMarker;
