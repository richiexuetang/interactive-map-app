import "@styles/globals.scss";
import theme from "@styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { MapProvider } from "../context/app-context";

function MyApp({ Component, pageProps }) {
  return (
    <MapProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </MapProvider>
  );
}

export default MyApp;
