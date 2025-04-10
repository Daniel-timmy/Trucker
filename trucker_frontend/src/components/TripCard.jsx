import React, { use } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api";
import { useState, useEffect } from "react";
import LogCard from "../components/LogCard";

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
    const [isSheetsVisible, setIsSheetsVisible] =  useState(false);
    const [driver, setDriver] = useState({});
    const [logsheets, setLogsheets] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);
    
    const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, pad to 2 digits
    const day = String(today.getDate()).padStart(2, "0"); // Pad to 2 digits
    return `${year}-${month}-${day}`; // Returns e.g., "2025-04-05"
  };
  const getDriver = () => {
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
        })
        .catch((err) => console.log(err));
    }
  };
  const getLogsheets = () => {
    if (currentTrip === null) {
      return;
    }

    const id = currentTrip.id;
    api
      .get(`logsheets/${id}/trips/`)
      .then((res) => res.data)
      .then((data) => {
        setLogsheets(data.reverse());
      })
      .catch((err) => console.log(err))
      
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
  const toggleSheetsVisibility = (trip) => {
setIsSheetsVisible((prev) => !prev );
setCurrentTrip(trip);
}

useEffect(()=> {
if (isSheetsVisible !== true) return;
getLogsheets();
}, [isSheetsVisible]);

useEffect (()=> getDriver(), []);

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
              <h6 className="small d-flex align-self-start">
                Pickup Location:
              </h6>
              <h6>{pickup_location}</h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start">
                Dropoff Location:
              </h6>
              <h6>{dropoff_location}</h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start">
                Current Location:
              </h6>
              <h6>{current_location}</h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start">H.O.C:</h6>
              <h6>{home_operating_center}</h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start">Start Date:</h6>
              <h6>{start_date}</h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start">End Date:</h6>
              <h6>{end_date}</h6>
            </Col>

            <Col>
              <h6 className="small d-flex align-self-start">Status:</h6>
              <h6>{status}</h6>
            </Col>
            <Col>
              <h6 className="small d-flex align-self-start">Vehicle No:</h6>
              <h6>{vehicle_no}</h6>
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
                >
                  Update Info
                </Button>
              </Col>
            )}

            <Col>
              <Button
            variant={isSheetsVisible ? "outline-dark" : "outline-primary"}
            onClick={toggleSheetsVisibility(trip)}
            style={{ fontSize: "0.9em" }}
          >
            {isSheetsVisible ? "Hide Sheets" : "Show Sheets"}
          </Button>

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
      <Container>
        {isSheetsVisible && logsheets.length > 0 && (
  <ul>
    {logsheets.map((logsheet) => (
      <LogCard
        key={logsheet.id}
        logsheet={logsheet}
        trip={currentTrip}
        driver={driver}
      />
    ))}
  </ul>
)}
      </Container>
    </>
  );
};

export default TripCard;
