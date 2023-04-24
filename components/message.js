import { Box, Link } from '@chakra-ui/react'

export const Message = () => {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      p='2'
      w='100%'
      bg='gray.900'
    >
      <Link color='gray.50' target="_blank" href="https://stand-with-ukraine.pp.ua">🇺🇦 #StandWithUkraine</Link>
    </Box>
  );
}