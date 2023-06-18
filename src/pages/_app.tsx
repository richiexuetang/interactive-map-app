import "react-toastify/dist/ReactToastify.css";

import theme from "@styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { Session } from 'next-auth'

import { MapProvider } from "@context/app-context";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session; }>) {
  return (
    <SessionProvider session={session}>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={true}
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
    </SessionProvider>
  );
}

export default MyApp;
