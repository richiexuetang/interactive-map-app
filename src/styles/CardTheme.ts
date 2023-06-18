import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    backgroundColor: 'app.modal',
    color: 'app.text'
  },
  header: {
    paddingBottom: '1.5em',
  },
  body: {
    paddingTop: '1em',
  },
})

const sizes = {
  md: definePartsStyle({
    container: {
      borderRadius: '0px',
    },
  }),
}

export const cardTheme = defineMultiStyleConfig({ baseStyle, sizes })