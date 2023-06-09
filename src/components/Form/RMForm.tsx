import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import RichEditor from "@components/Editor/RichEditor";
import { useFormik } from "formik";
import * as React from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  markerType: Yup.number().required(),
  markerName: Yup.string().required(),
  lat: Yup.number(),
  lng: Yup.number(),
});

const RMForm = (props) => {
  const { markerInfo, isOpen, onClose } = props;
  const {
    descriptions = [],
    lat = null,
    lng = null,
    markerName = "",
    id,
  } = markerInfo;

  const formik = useFormik({
    initialValues: {
      markerName: markerName,
      lat: lat,
      lng: lng,
      description: "",
    },
    onSubmit: () => {},
    validationSchema: validationSchema,
  });

  const handleSubmit = async () => {
    const { markerName: newName, lat: newLat, lng: newLng, description } = formik.values;
    
    try {
      let newDesc = [...descriptions];
      if (descriptions.length > 0) {
        newDesc = [...descriptions];
      }
      if (description) {
        newDesc = [...newDesc, description];
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/editMarker?id=` + id,
        {
          method: "POST",
          body: JSON.stringify({
            markerName: newName,
            lat: newLat,
            lng: newLng,
            descriptions: newDesc,
          }),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();

      toast.success("Marker update success");
    } catch (errorMessage: any) {
      toast.error(errorMessage);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" mt={3}>
          Edit Marker
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <FormLabel>Marker Name:</FormLabel>
            <Input
              name="markerName"
              onChange={formik.handleChange}
              value={formik.values.markerName}
            />

            <FormLabel>Latitude:</FormLabel>
            <Input
              name="lat"
              onChange={formik.handleChange}
              value={formik.values.lat}
            />

            <FormLabel>Longitude:</FormLabel>
            <Input
              name="lng"
              onChange={formik.handleChange}
              value={formik.values.lng}
            />

            <FormLabel>New Description:</FormLabel>
            <Box paddingInline="1rem" border="1px solid" h="400px">
              <RichEditor
                setFieldValue={(val) =>
                  formik.setFieldValue("description", val)
                }
                value={formik.values.description}
              />
            </Box>

            <Box display="flex" py={3}>
              <Button onClick={handleSubmit} type="submit">
                Submit
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </Box>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RMForm;
