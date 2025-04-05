import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import LoadingIndicator from "./LoadingIndicator";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const TripForm = ({ route, method, trip }) => {
  const [pickup_location, setPickupLocation] = useState("");
  const [dropoff_location, setDropoffLocation] = useState("");
  const [current_location, setCurrentLocation] = useState("");
  const [home_operating_center, setHomeOperatingCenter] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [vehicle_no, setVehicleNo] = useState("");
  const [trailer_no, setTrailerNo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const title = method === "new" ? "Create Trip" : "Edit Trip";

  const updateFields = () => {
    setPickupLocation(trip.pickup_location);
    setDropoffLocation(trip.dropoff_location);
    setCurrentLocation(trip.current_location);
    setHomeOperatingCenter(trip.home_operating_center);
    setStartDate(trip.start_date.split("T")[0]);
    setEndDate(trip.end_date);
    setStatus(trip.status);
    setVehicleNo(trip.vehicle_no);
    setTrailerNo(trip.trailer_no);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !pickup_location ||
      !dropoff_location ||
      !current_location ||
      !home_operating_center ||
      !start_date ||
      !end_date ||
      !status ||
      !vehicle_no ||
      !trailer_no
    ) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);
    console.log(import.meta.env.VITE_API_URL);

    try {
      if (method === "new") {
        const res = await api.post(route, {
          pickup_location,
          dropoff_location,
          current_location,
          home_operating_center,
          start_date,
          end_date,
          status,
          vehicle_no,
          trailer_no,
        });
        if (res.status === 201) {
          alert(`Trip Created Successfully: ${res.data.id}`);
        }
        navigate("/trips");
      } else {
        const res = await api.patch(route, {
          pickup_location,
          dropoff_location,
          current_location,
          home_operating_center,
          start_date,
          end_date,
          status,
          vehicle_no,
          trailer_no,
        });
        if (res.status === 200) {
          alert(`Trip Updated Successfully: ${res.data.id}`);
        }
        navigate("/trips");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (method === "edit") {
      updateFields();
    }
  }, []);
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Card
          body
          border="dark"
          className="text-white"
          bg="dark"
          style={{
            boxShadow: "rgb(157, 154, 154) 0px 5px 15px",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <Container
            className="align-items-center"
            style={{ fontSize: "0.7rem" }}
          >
            <Card.Header className="d-flex align-items-start">
              <h6>{title}</h6>
            </Card.Header>
            <Row xs={3} lg={4}>
              <Col>
                <h6 className="small">Pickup Location:</h6>
                <Form.Control
                  type="text"
                  defaultValue={pickup_location}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
              </Col>
              <Col>
                <h6 className="small">Dropoff Location:</h6>
                <Form.Control
                  type="text"
                  defaultValue={dropoff_location}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                />
              </Col>
              <Col>
                <h6 className="small">Current Location:</h6>
                <Form.Control
                  type="text"
                  defaultValue={current_location}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                />
              </Col>
              <Col>
                <h6 className="small">H.O.C:</h6>
                <Form.Control
                  type="text"
                  defaultValue={home_operating_center}
                  onChange={(e) => setHomeOperatingCenter(e.target.value)}
                />
              </Col>
              <Col>
                <h6 className="small">Start Date:</h6>
                <Form.Control
                  type="date"
                  defaultValue={start_date}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Col>
              <Col>
                <h6 className="small">End Date:</h6>
                <Form.Control
                  type="date"
                  defaultValue={end_date}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Col>

              <Col>
                <h6 className="small">Vehicle No:</h6>
                <Form.Control
                  type="text"
                  defaultValue={vehicle_no}
                  onChange={(e) => setVehicleNo(e.target.value)}
                />
              </Col>
              <Col>
                <h6 className="small">Trailer No:</h6>
                <Form.Control
                  type="text"
                  defaultValue={trailer_no}
                  onChange={(e) => setTrailerNo(e.target.value)}
                />
              </Col>
              <Col>
                <h6 className="small">Status:</h6>
                <Form.Select
                  id="status"
                  defaultValue={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value=""></option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Col>
            </Row>
            <hr />
            <Row xs={3}>
              <Col>
                <Button
                  type="submit"
                  variant="dark"
                  disabled={
                    !pickup_location ||
                    !dropoff_location ||
                    !current_location ||
                    !home_operating_center ||
                    !start_date ||
                    !end_date ||
                    !status ||
                    !vehicle_no ||
                    !trailer_no
                  }
                >
                  {title}
                </Button>
              </Col>
              {method === "edit" ? (
                <Col>
                  <Button variant="outline-light">View LogSheets</Button>
                </Col>
              ) : null}
            </Row>
          </Container>
        </Card>
      </Form>
    </>
  );
};

export default TripForm;
