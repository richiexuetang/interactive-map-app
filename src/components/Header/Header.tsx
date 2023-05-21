import {LogoContainer} from '@components/Container';

import { chakra } from '@chakra-ui/react';

const Header = () => {
  return (
    <chakra.header w='100%' fontSize='1em' color='app.text' bg='app.background' p='1em 0' m='0'>
        <LogoContainer />
    </chakra.header>
  );
};

export default Header;
