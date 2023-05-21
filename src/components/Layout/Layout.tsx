import Head from 'next/head';

import { Container } from '@chakra-ui/react';

import Footer from '@components/Footer';

const Layout = ({children}) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container minH='100vh' mx='0' maxW='100%'>{children}</Container>
      <Footer />
    </>
  );
};

export default Layout;
