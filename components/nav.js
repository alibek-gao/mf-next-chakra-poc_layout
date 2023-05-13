import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Links = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing federated', href: '/pricing'},
  { label: 'test one', href: '/test/one'},
  { label: 'test two', href: '/test/two'},
  { label: 'test not found', href: '/test/not-found'},
  { label: 'dynamic remote 1', href: '/shop/Featured'},
  { label: 'dynamic remote 2', href: '/content/Hero'},
];

const NavLink = ({ children, href }) => (
  <Link
    href={href}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: 'gray.200',
    }}>
    {children}
  </Link>
);

export default function Nav() {
  const { isOpen = false, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={'gray.100'} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>Logo</Box>
          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link.label} href={link.href}>{link.label}</NavLink>
            ))}
          </HStack>
        </HStack>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link.label} href={link.href}>{link.label}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
