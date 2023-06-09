import {
  Box,
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Radio,
  Textarea,
} from "@chakra-ui/react";
import RichEditor from "@components/Editor/RichEditor";
import { Formik } from "formik";
import {
  CheckboxContainer,
  CheckboxControl,
  CheckboxSingleControl,
  InputControl,
  NumberInputControl,
  PercentComplete,
  RadioGroupControl,
  ResetButton,
  SelectControl,
  SubmitButton,
} from "formik-chakra-ui";
import * as React from "react";
import * as Yup from "yup";
import { EditorState, convertToRaw } from "draft-js";

const validationSchema = Yup.object({
  markerType: Yup.number().required(),
  markerName: Yup.string().required(),
  lat: Yup.number(),
  lng: Yup.number(),
});

const RMForm = (props) => {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const { markerInfo, isOpen, onClose } = props;
  const {
    descriptions = [],
    lat = null,
    lng = null,
    markerName = "",
    categoryId = null,
    id,
    markerTypeId,
  } = markerInfo;

  const initialValues = {
    markerType: 1,
    markerName: markerName,
    lat: lat,
    lng: lng,
    descriptions: descriptions,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={() => console.log('submitting')}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, values, errors }) => (
              <Box
                borderWidth="1px"
                rounded="lg"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                maxWidth={800}
                p={6}
                m="10px auto"
                as="form"
                onSubmit={handleSubmit as any}
              >
                <SelectControl
                  name="markerType"
                  selectProps={{ placeholder: "Select Marker Type" }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </SelectControl>
                <InputControl name="markerName" label="Title" />
                <InputControl name="lat" label="Latitude" />
                <InputControl name="lng" label="Longitude" />

                {descriptions.map((value, i) => (
                  <Textarea
                    id={i.toString()}
                    key={i}
                    value={value}
                    onChange={(e) => console.log(e, i)}
                  />
                ))}
                <Box paddingInline="1rem" border="1px solid" h="400px">
                  <RichEditor
                    editorState={editorState}
                    setEditorState={setEditorState}
                  />
                </Box>
                {/* <PercentComplete /> */}
                <ButtonGroup>
                  <SubmitButton>Submit</SubmitButton>
                  <Button onClick={onClose}>Cancel</Button>
                </ButtonGroup>

                {/* <Box as="pre" marginY={10}>
                  {JSON.stringify(values, null, 2)}
                  <br />
                  {JSON.stringify(errors, null, 2)}
                </Box> */}
              </Box>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RMForm;
