import { Box } from "@chakra-ui/react";
import ClipLoader from "react-spinners/ClipLoader";

function Loader({loading}) {
  return (
    <Box display="block" top="100px !important" mt="300px">
      <ClipLoader
        size={100}
        loading={loading}
        cssOverride={{
          display: "block",
          margin: "0 auto",
          borderColor: "#af894d",
        }}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </Box>
  );
}

export default Loader;
