import Head from "next/head";

import Layout from "@components/Layout";
import { ImageLayout } from "@layout/Image";
import { gamesData } from "@data/imageData";

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
      <ImageLayout imageData={gamesData} imageType="Game" />
    </Layout>
  );
}
