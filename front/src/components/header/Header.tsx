import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuthContext } from '@/contexts/authContext';
import ModalUpdateUser from '../modalUpdateUser';
import ModalUpdateAddress from '../modalUpdateAddress';
import { useState } from 'react';
import NextLink from 'next/link';
import { iUserRes } from '@/types/user.context';

interface IHeaderProps {
  userName?: string;
  userImage?: string;
  isLogged?: boolean;
}

interface ResponsiveMenuProps {
  isOpen: boolean;
  user: iUserRes;
}

const Header = () => {
  const { isOpen } = useDisclosure();
  const { user } = useAuthContext();

  return (
    <Box
      w={'100%'}
      h={'80px'}
      bg={'grey.10'}
      borderBottom={'2px solid'}
      borderColor={'grey.300'}
      fontSize={24}
      display={'flex'}
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      pos="fixed"
      top="0"
      left="0"
      zIndex={'1000'}
    >
      <Box w={'70vw'} pl={'60px'}>
        <Box
          w={'160px'}
          bgGradient={'linear(to right,#0B0D0D, #4529E6)'}
          bgClip={'text'}
        >
          <Link as={NextLink} href="/">
            <Image src="/assets/Motors-shop-header.svg" alt="header img" />
          </Link>
        </Box>
      </Box>
      <HStack
        display={{ base: 'none', md: 'flex' }}
        alignItems={'center'}
        gap={'44px'}
        borderLeft={'2px solid'}
        borderColor={'grey.300'}
        h={'100%'}
        pr={'60px'}
        pl={'44px'}
      >
        <HeaderLoggedContent
          userName={user.name}
          userImage={user.profile_img}
          isLogged={Boolean(user.name)}
        />
      </HStack>
      <Box
        display={{ base: 'flex', md: 'none' }}
        w={'30vw'}
        justifyContent={'flex-end'}
        pr={'0'}
      >
        <ResponsiveMenu user={user} isOpen={isOpen} />
      </Box>
    </Box>
  );
};

const HeaderLoggedContent = ({
  userName,
  userImage,
  isLogged,
}: IHeaderProps) => {
  const [isOpenUpdateUser, setIsOpenUpdateUser] = useState(false);
  const [isOpenUpdateAddress, setIsOpenUpdateAddress] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onOpenUpdateUser = () => setIsOpenUpdateUser(true);
  const onCloseUpdateUser = () => setIsOpenUpdateUser(false);

  const onOpenUpdateAddress = () => setIsOpenUpdateAddress(true);
  const onCloseUpdateAddress = () => setIsOpenUpdateAddress(false);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleLogout } = useAuthContext();

  // const handleLogout = () => {
  //   onCloseUpdateUser();
  //   onCloseUpdateAddress();
  // };

  return isLogged ? (
    <>
      <Menu>
        <MenuButton>
          <Flex alignItems="center" gap="16px">
            <Avatar
              borderRadius="full"
              boxSize={'32px'}
              name={userName}
              src={userImage}
            />
            <Text variant={'body-1-400'}>{userName}</Text>
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={onOpenUpdateUser}>Editar Perfil</MenuItem>
          <MenuItem onClick={onOpenUpdateAddress}>Editar Endereço</MenuItem>
          <MenuItem>Meus Anúncios</MenuItem>
          <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
        </MenuList>
      </Menu>
      <ModalUpdateUser isOpen={isOpenUpdateUser} onClose={onCloseUpdateUser} />
      <ModalUpdateAddress
        isOpen={isOpenUpdateAddress}
        onClose={onCloseUpdateAddress}
      />
    </>
  ) : (
    <>
      <Link as={NextLink} variant={'header'} href="/login">
        Fazer Login
      </Link>
      <Link
        as={NextLink}
        variant={'btnOutlineGreyHeader'}
        px={'18px'}
        href="/register"
      >
        Cadastrar
      </Link>
    </>
  );
};

const ResponsiveMenu = ({ isOpen }: ResponsiveMenuProps) => {
  return (
    <Menu>
      <MenuButton as={Button} bg={'grey-10'} position={'relative'}>
        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
      </MenuButton>
      <MenuList
        w={{ base: '100vw', sm: '90%' }}
        display={'flex'}
        flexDirection="column"
        gap={'18px'}
        p={'20px 12px'}
        m={0}
      >
        <MenuItem bg={'grey.10'}>
          <Link as={NextLink} variant={'simple_1'} href="/login">
            Fazer Login
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            as={NextLink}
            variant={'btnOutlineGreyHeader'}
            w={'374px'}
            href="/register"
          >
            Cadastrar
          </Link>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
export default Header;
