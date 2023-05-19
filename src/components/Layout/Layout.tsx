import Head from 'next/head';

import Footer from '@components/Footer';
import { LogoContainer } from '@components/Container';
import { Container } from '@chakra-ui/react';

const Layout = ({children}) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LogoContainer />
      <Container minH='100vh' mx='0' maxW='100%'>{children}</Container>
      <Footer />
    </>
  );
};

export default Layout;
