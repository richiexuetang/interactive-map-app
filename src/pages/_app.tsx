import "@styles/globals.scss";
import theme from "@styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import { MapProvider } from "../context/app-context";

function MyApp({ Component, pageProps }) {
  return (
    <MapProvider>
      <ChakraProvider theme={theme}>
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
        <Component {...pageProps} />
      </ChakraProvider>
    </MapProvider>
  );
}

export default MyApp;
