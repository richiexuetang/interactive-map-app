import {defineStyleConfig} from "@chakra-ui/react";

export const Button = defineStyleConfig({
    baseStyle: {
        color: "#af894d !important",
        borderRadius: "0",
        bg: "transparent",
        __hover: {bg: "#37373766"},
        border: "0px solid"
    },
    sizes: {
        sm: {
            fontSize: "sm",
            px: 4, 
            py: 3 
        },
        md: {
            fontSize: "md",
            px: 6, 
            py: 4 
        }
    },
    variants: {
        mapLink: {
            flex: "1 1 33%",
            m: "2px 1%",
            p: "4px 1%",
            textDecor: "none",
            opacity: "0.9",
            transition: "all 0.2s",
            willChange: "backgrond-color,opacity",
            fontSize: "15px !important",
            fontWeight: 'normal',
            _hover:{ bg: "#2a2927", pointerEvents: "pointer"}
        }, 
        underlined: {
            _hover: { textDecor: "underline !important"},
        }
    },
    defaultProps: {
        size: "md"
    }
});
