import type { NextPage } from "next";
import React from "react";
import { Game } from "../game/components/Game";
import Footer from "../layout/components/Footer";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Memory game</title>
        <meta
          name="description"
          content="A free and open-source memory game built using XState and Typescript"
        />
      </Head>

      <Game />
      <Footer />
    </>
  );
};

export default Home;
