import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "@styles/globals.scss";
import theme from "@styles/theme";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import ClipLoader from "react-spinners/ClipLoader";
import "react-toastify/dist/ReactToastify.css";

import { MapProvider } from "../context/app-context";

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.isReady && setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Box display="block" top="100px !important" mt="300px">
        <ClipLoader
          size={100}
          loading={isLoading}
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
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <MapProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </MapProvider>
    </>
  );
}

export default MyApp;
