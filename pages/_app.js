import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, cookieStorageManagerSSR } from '@chakra-ui/react'

import Nav from '@/components/nav'

const theme = {
  config: {
    initialColorMode: 'dark',
  }
}
export default function App({ Component, pageProps, cookies }) {
  const colorModeManager = cookieStorageManagerSSR(cookies);

  return (
    <CacheProvider>
      <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
        <Nav />
        <Component {...pageProps} />
      </ChakraProvider>
    </CacheProvider>
  )
}

App.getInitialProps = (data) => {
  const { ctx } = data;
  return {
    cookies: ctx?.req?.headers?.cookie || '',
  };
};
