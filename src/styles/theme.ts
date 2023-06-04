import {extendTheme} from "@chakra-ui/react";

import {Button} from "./ButtonStyles";
import {inputTheme} from "./InputTheme";

const styles = {
    global: () => ({
        body: {
            margin: 0,
            padding: 0,
            bg: "app.background",
            color: "app.text",
            fontSize: "15px !important"
        },
        span: {
            textWrap: 'nowrap',
            fontSize: '1rem',
            letterSpacing: '2px'
        }
    })
};

const components = {
    Button,
    Modal: {
        baseStyle: () => ({
            dialog: {
                minWidth: "75%",
                bg: "app.modal"
            }
        })
    },
    Card: {
        baseStyle: () => ({
            body: {
                bg: "app.modal",
                color: "app.text",
                borderColor: "app.background",
                border: "1px solid",
                borderBottom: "none"
            },
            footer: {
                bg: "app.modal",
                color: "app.text",
                borderColor: "app.background",
                border: "1px solid"
            }
        })
    },
    Drawer: {
        variants: {
            aside: {
                dialog: {
                    pointerEvents: "auto",
                    background: "app.modal"
                },
                dialogContainer: {
                    pointerEvents: "none"
                }
            }
        }
    },
    Input: inputTheme
};

const config = {
    initialColorMode: "dark"
};

const theme = extendTheme({
    components,
    styles,
    config,
    colors: {
        app: {
            modal: "#221c0f",
            background: "#967959",
            text: "#fbe4bd"
        },
        sidebar: {
            arrow: "#af894d",
            content: "#221c0f"
        }
    }
});

export default theme;
