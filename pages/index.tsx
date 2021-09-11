import type { NextPage } from "next";
import React from "react";
import { Game } from "../game/components/Game";
import Footer from "../layout/components/Footer";

const Home: NextPage = () => {
  return (
    <>
      <Game />
      <Footer />
    </>
  );
};

export default Home;
