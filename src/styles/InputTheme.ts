import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

  const baseStyle = definePartsStyle({
    field: {
        borderColor: "#584835",
        bg: "transparent",
        color: "#af894d",
        border: '1px solid',
        borderRadius: 'full',
        _focus: {
            borderColor: "#584835 !important",
            bg: "transparent",
            color: "#af894d !important",
            boxShadow: "none"
        },
    },
  })
  
  export const inputTheme = defineMultiStyleConfig({ baseStyle })