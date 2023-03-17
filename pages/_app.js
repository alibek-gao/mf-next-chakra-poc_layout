import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import Nav from '@/components/nav'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }
})

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Nav />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
