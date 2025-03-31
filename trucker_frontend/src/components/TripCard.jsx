import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

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
              <Button variant="outline-light">View LogSheets</Button>
            </Col>
          </Row>
        </Container>
      </Card>
    </>
  );
};

export default TripCard;
