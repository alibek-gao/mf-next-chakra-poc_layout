import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'

import Nav from '@/components/nav'
export default function App({ Component, pageProps }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <Nav />
        <Component {...pageProps} />
      </ChakraProvider>
    </CacheProvider>
  )
}
