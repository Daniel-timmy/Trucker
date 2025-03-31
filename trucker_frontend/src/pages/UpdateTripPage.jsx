import { useLocation, useParams } from "react-router-dom";
import TripForm from "../components/TripForm";
import Header from "../components/Header";
import Footer from "../components/Footer2";
import React from "react";

const UpdatePage = () => {
  const location = useLocation();
  const { trip } = location.state || {};
  const { id } = useParams();

  return (
    <>
      <Header />
      <div className="d-flex align-items-center justify-content-center mt-5">
        <h1>Update Trip</h1>
      </div>

      <div
        className="d-flex justify-content-center vh-100"
        style={{ marginTop: "200px" }}
      >
        <TripForm trip={trip} method="edit" route={`/trips/${id}/`} />
      </div>
      <Footer />
    </>
  );
};

export default UpdatePage;
