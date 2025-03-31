import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TripForm from "../components/TripForm";
import Header from "../components/Header";
import Footer from "../components/Footer2";
import React from "react";

const CreatePage = () => {
  return (
    <>
      <Header />
      <div className="d-flex align-items-center justify-content-center mt-5">
        <h1>Create a New Trip</h1>
      </div>
      <div
        className="d-flex justify-content-center vh-100"
        style={{ marginTop: "200px" }}
      >
        <TripForm method="new" route={`/trips/new`} />
      </div>
      <Footer />
    </>
  );
};

export default CreatePage;
