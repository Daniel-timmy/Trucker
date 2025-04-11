import Header from "../components/Header";
import { Link } from "react-router-dom";
import TripCard from "../components/TripCard";
import { useState, useEffect } from "react";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";
import Footer from "../components/Footer2";
import React from "react";
import { Button } from "react-bootstrap";

const TripPage = () => {
  const [currentTrip, setCurrentTrip] = useState([]);
  const [pastTrip, setPastTrip] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pLoading, setPloading] = useState(false);

  const getCurrentTrip = (status) => {
    setLoading(true);
    api
      .get(`trips/status/${status}/`)
      .then((res) => res.data)
      .then((data) => {
        setCurrentTrip(data[0]);
      })
      .catch((err) => alert(err))
      .finally(setLoading(false));
  };

  const getPastTrip = (status) => {
    setPloading(true);
    api
      .get(`trips/status/${status}`)
      .then((res) => res.data)
      .then((data) => {
        setPastTrip(data);
        setPloading(false);
      })
      .catch((err) => {
        alert(err);
        setPloading(false);
      });
  };

  useEffect(() => {
    getCurrentTrip("in_progress");
    getPastTrip("completed");
  }, []);

  return (
    <>
      <Header />
      <div className="d-flex align-items-center justify-content-between px-5">
        <h2>Current Trip</h2>
        <Button variant="success" as={Link} to="/trips/create">
          New Trip
        </Button>
      </div>
      <hr />

      {loading ? (
        <LoadingIndicator />
      ) : !currentTrip ? (
        <h5 className="small">You have no current trip</h5>
      ) : (
        <TripCard key={currentTrip.id} period="current" trip={currentTrip} />
      )}
      <hr />
      <div className="d-flex mt-5 align-items-center justify-content-between px-5">
        <h2>Past Trip</h2>
      </div>
      <hr />

      <section style={{ height: "auto" }}>
        {pLoading ? (
          <LoadingIndicator />
        ) : !pastTrip ? (
          <h5 className="small">You have no past trip</h5>
        ) : (
          <ul>
            {pastTrip.map((trip) => (
              <TripCard key={trip.id} period="past" trip={trip} />
            ))}
          </ul>
        )}
      </section>
      <Footer />
    </>
  );
};

export default TripPage;
