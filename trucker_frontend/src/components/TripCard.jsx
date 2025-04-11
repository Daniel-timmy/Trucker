import React, { use } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api";
import { useState, useEffect } from "react";
import LogCard from "../components/LogCard";
import { ACCESS_TOKEN, DRIVER } from "../constants";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";

const TripCard = ({
  period,
  trip: {
    id,
    current_location,
    pickup_location,
    dropoff_location,
    home_operating_center,
    start_date,
    end_date,
    status,
    vehicle_no,
    trailer_no,
  },
  trip,
}) => {
  const [isSheetsVisible, setIsSheetsVisible] = useState(false);
  const [driver, setDriver] = useState(null);
  const [logsheets, setLogsheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, pad to 2 digits
    const day = String(today.getDate()).padStart(2, "0"); // Pad to 2 digits
    return `${year}-${month}-${day}`; // Returns e.g., "2025-04-05"
  };
  const getDriver = () => {
    const driver = localStorage.getItem(DRIVER);
    if (driver) {
      setDriver(JSON.parse(driver));
      return;
    }
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      navigate("/login");
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      navigate("/login");
    } else {
      api
        .get(`${decoded.user_id}/`)
        .then((res) => res.data)
        .then((data) => {
          setDriver(data);
          localStorage.setItem(DRIVER, JSON.stringify(data));
        })
        .catch((err) => console.log(err));
    }
  };
  const getLogsheets = () => {
    if (trip === null) {
      return;
    }
    setLoading(true);

    const id = trip.id;
    api
      .get(`logsheets/${id}/trips/`)
      .then((res) => res.data)
      .then((data) => {
        setLogsheets(data.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const setRefueling = async () => {
    const last_refuel = getCurrentDate();
    const last_refuel_mileage = trip.total_mileage;

    const res = await api.patch(`trips/${id}/refuel/`, {
      last_refuel_mileage,
    });
    if (res.status === 200) {
      alert("Refueling set successfully!");
    }
  };

  useEffect(() => {
    if (isSheetsVisible !== true) return;
    getLogsheets();
  }, [isSheetsVisible]);

  useEffect(() => {
    getDriver();
  }, []);

  return (
    <>
      <Card
        body
        border="dark"
        className="mx-auto mb-5"
        bg="light"
        style={{
          boxShadow: "rgb(157, 154, 154) 0px 5px 15px",
          maxWidth: "70%",
        }}
      >
        <Container
          className="align-items-center"
          style={{ fontSize: "0.7rem" }}
        >
          <Card.Header className="d-flex align-items-start">
            <h6 className="small">Trip ID:{id}</h6>
          </Card.Header>
          <Row xs={3} lg={4}>
            <Col>
              <h6 className="small d-flex align-self-start fw-bold">
                Pickup Location:
              </h6>
              <h6 style={{ fontSize: screenWidth < 400 ? "0.7rem" : "1.2rem" }}>
                {pickup_location}
              </h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start fw-bold">
                Dropoff Location:
              </h6>
              <h6 style={{ fontSize: screenWidth < 400 ? "0.7rem" : "1.2rem" }}>
                {dropoff_location}
              </h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start fw-bold">
                Current Location:
              </h6>
              <h6 style={{ fontSize: screenWidth < 400 ? "0.7rem" : "1.2rem" }}>
                {current_location}
              </h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start fw-bold">H.O.C:</h6>
              <h6 style={{ fontSize: screenWidth < 400 ? "0.7rem" : "1.2rem" }}>
                {home_operating_center}
              </h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start fw-bold">
                Start Date:
              </h6>
              <h6 style={{ fontSize: screenWidth < 400 ? "0.7rem" : "1.2rem" }}>
                {start_date}
              </h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start fw-bold">
                End Date:
              </h6>
              <h6 style={{ fontSize: screenWidth < 400 ? "0.7rem" : "1.2rem" }}>
                {end_date}
              </h6>
            </Col>

            <Col>
              <h6 className="small d-flex align-self-start fw-bold">Status:</h6>
              <h6 style={{ fontSize: screenWidth < 400 ? "0.7rem" : "1.2rem" }}>
                {status}
              </h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start fw-bold">
                Vehicle No:
              </h6>
              <h6 style={{ fontSize: screenWidth < 400 ? "0.7rem" : "1.2rem" }}>
                {vehicle_no}
              </h6>
            </Col>
          </Row>
          <hr />
          <Row xs={3}>
            {period === "current" && (
              <Col>
                <Button
                  type="btn"
                  as={Link}
                  to={`/trips/${id}`}
                  state={{ trip }}
                  variant="dark"
                  style={{ fontSize: "0.8rem" }}
                >
                  Update Info
                </Button>
              </Col>
            )}

            <Col>
              {period !== "current" && (
                <Button
                  className="text-white"
                  onClick={() => setIsSheetsVisible(!isSheetsVisible)}
                  variant={isSheetsVisible ? "secondary" : "dark"}
                  style={{ fontSize: "0.9em" }}
                >
                  {isSheetsVisible ? "Hide Sheets" : "Show Sheets"}
                </Button>
              )}
            </Col>
          </Row>
        </Container>

        {status === "in_progress" ? (
          <Card.Footer className="text-muted text-center ">
            <small>Miles to refueling: {trip.miles_to_refuel}</small>
            {trip.refuel ? (
              <Button
                style={{ marginLeft: "50px" }}
                onClick={setRefueling}
                variant="danger"
              >
                Refuel
              </Button>
            ) : (
              <h1></h1>
            )}
          </Card.Footer>
        ) : (
          <h1></h1>
        )}
      </Card>

      {isSheetsVisible ? (
        loading ? (
          <LoadingIndicator />
        ) : (
          <Container style={{ marginBottom: "50px", maxWidth: "90%" }}>
            <h5 className="small">
              Logsheets for {trip.pickup_location} to {trip.dropoff_location}
            </h5>
            <ul>
              {logsheets.map((logsheet) => (
                <LogCard
                  key={logsheet.id}
                  logsheet={logsheet}
                  trip={trip}
                  driver={driver}
                />
              ))}
            </ul>
            {logsheets.length === 0 && <h4>No Logsheets for this trip</h4>}
            <hr style={{ border: "2px white solid" }} />
          </Container>
        )
      ) : (
        <h6></h6>
      )}
    </>
  );
};

export default TripCard;
