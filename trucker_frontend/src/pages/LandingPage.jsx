import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LogSheetsForm from "../components/LogSheetsForm";

import React from "react";

const LandingPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <LogSheetsForm />
      <Footer />
    </>
  );
};

export default LandingPage;
