import {
  Box,
  Button,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import RichEditor from "@components/Editor/RichEditor";
import { useMapContext } from "@context/app-context";
import { categoryIdNameMap } from "@data/categoryItemsConfig";
import useMapObject from "@hooks/useMapObject";
import { useFormik } from "formik";
import * as React from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  markerType: Yup.number().required(),
  markerName: Yup.string().required(),
  lat: Yup.number(),
  lng: Yup.number(),
});

const RMForm = (props) => {
  const { categoryMap } = useMapContext();
  const { markerInfo = {}, isOpen, onClose, onSubmit } = props;
  const {
    lat,
    lng,
    markerName = "",
    markerTypeId = 1,
    categoryId = 69,
    description = ""
  } = markerInfo;

  const formik = useFormik({
    initialValues: {
      markerName: markerName,
      markerType: markerTypeId,
      categoryId: categoryId,
      lat: lat,
      lng: lng,
      description: description,
    },
    onSubmit: () => {},
    validationSchema: validationSchema,
  });

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

            <FormLabel>Marker Type:</FormLabel>
            <Input
              name="markerType"
              onChange={formik.handleChange}
              value={formik.values.markerType}
            />

            <FormLabel>Category:</FormLabel>
            <Input
              name="categoryId"
              onChange={formik.handleChange}
              value={formik.values.categoryId}
            />
            <Select
              name="categoryId"
              onChange={formik.handleChange}
              value={formik.values.categoryId}
            >
              {categoryMap.map((category) => {
                return (
                  <option value={category}>
                    {categoryIdNameMap[category]}
                  </option>
                );
              })}
            </Select>

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
              <Button onClick={() => onSubmit(formik.values)} type="submit">
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
