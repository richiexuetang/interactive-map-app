import Head from "next/head";

import Layout from "@components/Layout";
import { ImageLayout } from "@layout/Image";
import { gamesData } from "@data/imageData";
import { LogoContainer } from "@components/Container";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Interactive Maps</title>
        <meta
          name="description"
          content="Interactive Maps for different RPGs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LogoContainer />
      <ImageLayout imageData={gamesData} imageType="Game" />
    </Layout>
  );
}
