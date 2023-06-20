import { extendTheme } from "@chakra-ui/react";

import { Button } from "./ButtonStyles";
import { inputTheme } from "./InputTheme";
import { cardTheme } from "./CardTheme";

const styles = {
  global: () => ({
    body: {
      margin: 0,
      padding: 0,
      bg: "app.background",
      color: "app.text",
      fontSize: "15px !important",
    },
    span: {
      textWrap: "nowrap !important",
      textAlign: "center",
      overflowWrap: "initial",
    },
    img: {
      maxWidth: "100%",
      height: "auto",
    },
    ol: {
      pl: "20px",
    },
    ul: {
      pl: "20px",
    },
    button: {
      pointEvents: "pointer",
    },
    p: {
      pt: "4px",
    },
  }),
};

const components = {
  Button,
  Card: cardTheme,
  Modal: {
    baseStyle: () => ({
      dialog: {
        minWidth: "75%",
        bg: "app.modal",
      },
    }),
  },
  Drawer: {
    variants: {
      aside: {
        dialog: {
          pointerEvents: "auto",
          background: "app.modal",
        },
        dialogContainer: {
          pointerEvents: "none",
        },
      },
    },
  },
  Input: inputTheme,
  Text: {
    baseStyle: {
      color: "#fbe4bd",
    },
  },
};

const config = {
  initialColorMode: "dark",
};

const theme = extendTheme({
  components,
  styles,
  config,
  colors: {
    app: {
      modal: "#221c0f",
      background: "#967959",
      text: "#fbe4bd",
    },
    sidebar: {
      arrow: "#af894d",
      content: "#221c0f",
    },
  },
});

export default theme;
