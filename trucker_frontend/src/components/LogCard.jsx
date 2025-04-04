import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import api from "../api";
import LineGraph from "./LineGraph";
import { useMediaQuery } from "react-responsive";

const LogCard = ({ logsheet, trip, driver }) => {
  const [isContainerVisible, setIsContainerVisible] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [dutyStatus, setDutyStatus] = useState("off_duty");
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedMileage, setUpdatedMileage] = useState(logsheet.total_mileage);
  const [updatedRemarks, setUpdatedRemarks] = useState(logsheet.remarks);
  const [entries, setEntries] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const toggleContainerVisibility = () => {
    setIsContainerVisible((prev) => !prev);
  };
  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(":");
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const roundedMinutes = Math.round(totalMinutes / 15) * 15;
    const newHours = Math.floor(roundedMinutes / 60)
      .toString()
      .padStart(2, "0");
    const newMinutes = (roundedMinutes % 60).toString().padStart(2, "0");
    setStartTime(`${newHours}:${newMinutes}`);
  };

  const handleNewEntryClick = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleUpdateLogSheet = () => {
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };
  const getEntriesForTrip = async () => {
    try {
      const res = await api.get(`logentries/${logsheet.id}/logsheets/`);
      console.log(res.data);
      setEntries(res.data);
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmitUpdateLogSheet = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`logsheets/${logsheet.id}/`, {
        total_mileage: updatedMileage,
        remarks: updatedRemarks,
      });
      console.log("Logsheet updated successfully:", res.data);
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating logsheet:", error.response?.data || error);
    }
  };

  const handleSubmitOverlay = async (e) => {
    e.preventDefault();
    const log_id = logsheet.id;
    const trip_id = trip.id;
    console.log({
      lat,
      long,
      location,
      duration,
      dutyStatus,
      activity,
      startTime,
      log_id,
      trip_id,
    });
    try {
      const res = await api.post(`logentries/${log_id}/logsheet/`, {
        lat: lat,
        long: long,
        location: location,
        span: duration,
        startTime: startTime,
        duty_status: dutyStatus,
        activity: activity,
        log_id: log_id,
        trip_id: trip_id,
      });
      alert("Entry saved successful");
    } catch (error) {
      setErrorDetails(
        error.response?.data?.details || "An unexpected error occurred."
      );
      console.log(error.response?.data?.details);
    } finally {
      setShowOverlay(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    getEntriesForTrip();
  }, [logsheet.id]);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <>
      <Card
        className="mx-auto mb-3"
        bg={isContainerVisible ? "secondary" : "light"}
        style={{ maxWidth: "90%", borderRadius: "10px", overflow: "hidden" }}
      >
        <Card.Body
          className="d-flex justify-content-between align-items-center small"
          style={{ fontSize: "0.8em", padding: "1rem" }}
        >
          <span>
            <strong>Date:</strong> {logsheet.date}
          </span>
          <span>
            <strong>ID:</strong> {logsheet.id}
          </span>
          <Button
            variant={isContainerVisible ? "outline-light" : "outline-primary"}
            onClick={toggleContainerVisibility}
            style={{ fontSize: "0.9em" }}
          >
            {isContainerVisible ? "Hide Details" : "Show Details"}
          </Button>
        </Card.Body>
      </Card>
      {isContainerVisible &&
        (isMobile ? (
          <Modal
            show={isContainerVisible}
            onHide={toggleContainerVisibility}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Driver's Record of Duty Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container fluid className="p-3">
                <h4 className="text-center mb-4" style={{ fontSize: "1.2em" }}>
                  Driver's Record of Duty Status
                </h4>
                <div style={{ fontSize: "0.9em" }}>
                  {/* ...existing content inside the card... */}
                  <Row className="mb-3">
                    <Col xs={12} md={4} className="mb-2">
                      <div>
                        <strong>Driver's Name:</strong>
                        <span>
                          {" "}
                          {driver.first_name + " " + driver.last_name}
                        </span>
                      </div>
                    </Col>
                    <Col xs={12} md={4} className="mb-2">
                      <div>
                        <strong>Total Miles Driven:</strong>
                        <span> {logsheet.total_mileage}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={4} className="mb-2">
                      <div>
                        <strong>Date:</strong>
                        <span> {logsheet.date}</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={12} md={4}>
                      <div>
                        <strong>Carrier Name:</strong>
                        <span> {logsheet.shipper}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={4}>
                      <div>
                        <strong>Carrier Address:</strong>
                        <span> {trip.dropoff_location}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={4}>
                      <div>
                        <strong>Commodity:</strong>
                        <span> {logsheet.commodity}</span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={12} md={4}>
                      <div>
                        <strong>Home Operating Center:</strong>
                        <span> {trip.home_operating_center}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={4}>
                      <div>
                        <strong>Vehicle No:</strong>
                        <span> {trip.vehicle_no}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={4}>
                      <div>
                        <strong>Trailer No:</strong>
                        <span> {trip.trailer_no}</span>
                      </div>
                    </Col>
                  </Row>
                  <LineGraph entries={entries} />
                  <div className="mt-4">
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Driving</th>
                          <th>Sleeper Berth</th>
                          <th>On Duty</th>
                          <th>Off Duty</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{logsheet.driving}</td>
                          <td>{logsheet.berth}</td>
                          <td>{logsheet.on_duty}</td>
                          <td>{logsheet.off_duty}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <div className="mt-4">
                    <strong>Remarks (e.g., Location, Duty Changes):</strong>
                    <p>{logsheet.remarks || "No remarks available."}</p>
                  </div>
                  <div className="mt-3">
                    <strong>Driver's Signature:</strong>
                    <p>{driver.first_name + " " + driver.last_name}</p>
                  </div>
                </div>
                {logsheet.date === today && (
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button variant="success" onClick={handleNewEntryClick}>
                      New Entry
                    </Button>
                    <Button variant="primary" onClick={handleUpdateLogSheet}>
                      Update Logsheet
                    </Button>
                  </div>
                )}
              </Container>
            </Modal.Body>
          </Modal>
        ) : (
          <Card
            className="mb-3 mx-auto"
            bg="light"
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              maxWidth: "90%",
            }}
          >
            <Container fluid className="p-3">
              <h4 className="text-center mb-4" style={{ fontSize: "1.2em" }}>
                Driver's Record of Duty Status
              </h4>
              <div style={{ fontSize: "0.9em" }}>
                <Row className="mb-3">
                  <Col xs={12} md={4} className="mb-2">
                    <div>
                      <strong>Driver's Name:</strong>
                      <span> {driver.first_name + " " + driver.last_name}</span>
                    </div>
                  </Col>
                  <Col xs={12} md={4} className="mb-2">
                    <div>
                      <strong>Total Miles Driven:</strong>
                      <span> {logsheet.total_mileage}</span>
                    </div>
                  </Col>
                  <Col xs={12} md={4} className="mb-2">
                    <div>
                      <strong>Date:</strong>
                      <span> {logsheet.date}</span>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={12} md={4}>
                    <div>
                      <strong>Carrier Name:</strong>
                      <span> {logsheet.shipper}</span>
                    </div>
                  </Col>
                  <Col xs={12} md={4}>
                    <div>
                      <strong>Carrier Address:</strong>
                      <span> {trip.dropoff_location}</span>
                    </div>
                  </Col>
                  <Col xs={12} md={4}>
                    <div>
                      <strong>Commodity:</strong>
                      <span> {logsheet.commodity}</span>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={12} md={4}>
                    <div>
                      <strong>Home Operating Center:</strong>
                      <span> {trip.home_operating_center}</span>
                    </div>
                  </Col>
                  <Col xs={12} md={4}>
                    <div>
                      <strong>Vehicle No:</strong>
                      <span> {trip.vehicle_no}</span>
                    </div>
                  </Col>
                  <Col xs={12} md={4}>
                    <div>
                      <strong>Trailer No:</strong>
                      <span> {trip.trailer_no}</span>
                    </div>
                  </Col>
                </Row>
                <LineGraph entries={entries} />
                <div className="mt-4">
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Driving</th>
                        <th>Sleeper Berth</th>
                        <th>On Duty</th>
                        <th>Off Duty</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{logsheet.driving}</td>
                        <td>{logsheet.berth}</td>
                        <td>{logsheet.on_duty}</td>
                        <td>{logsheet.off_duty}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                <div className="mt-4">
                  <strong>Remarks (e.g., Location, Duty Changes):</strong>
                  <p>{logsheet.remarks || "No remarks available."}</p>
                </div>
                <div className="mt-3">
                  <strong>Driver's Signature:</strong>
                  <p>{driver.first_name + " " + driver.last_name}</p>
                </div>
              </div>
              {logsheet.date === today && (
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <Button variant="success" onClick={handleNewEntryClick}>
                    New Entry
                  </Button>
                  <Button variant="primary" onClick={handleUpdateLogSheet}>
                    Update Logsheet
                  </Button>
                </div>
              )}
            </Container>
          </Card>
        ))}
      {/* Overlay Modal */}
      <Modal show={showOverlay} onHide={handleCloseOverlay} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitOverlay}>
            <Form.Group className="mb-3" controlId="formLat">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                step="0.000001"
                placeholder="Enter latitude"
                required
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLong">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                step="0.000001"
                placeholder="Enter longitude"
                required
                value={long}
                onChange={(e) => setLong(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDuration">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={startTime}
                required
                step="900" // 15 minutes in seconds
                onChange={handleTimeChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                pattern="^[0-2][0-3]:(00|15|30|45)$"
                required
                placeholder="E.g 01:45"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <Form.Text className="text-danger">
                {duration &&
                  !/^[0-2][0-3]:(00|15|30|45)$/.test(duration) &&
                  "Invalid Format. The hours can range from 00-23 but the min is restricted to 00, 15, 30, and 45"}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDutyStatus">
              <Form.Label>Duty Status</Form.Label>
              <Form.Select
                value={dutyStatus}
                required
                onChange={(e) => setDutyStatus(e.target.value)}
              >
                <option value="off_duty">Off Duty</option>
                <option value="sleeper">Sleeper</option>
                <option value="driving">Driving</option>
                <option value="on_duty">On Duty</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formActivity">
              <Form.Label>Activity</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter activity(Scaling, DropOff, refueling e.t.c)"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                pattern="^.{5,}$"
                required
              />
              <Form.Text className="text-danger">
                {activity &&
                  !/^.{5,}$/.test(activity) &&
                  "Activity can not be empty and must be at least 5 characters"}
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Save Entry
            </Button>
          </Form>
          {errorDetails && (
            <div className="mt-3 text-danger text-center">
              <strong>Error:</strong> {errorDetails}
            </div>
          )}
        </Modal.Body>
      </Modal>
      {/* Update Logsheet Modal */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Logsheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitUpdateLogSheet}>
            <Form.Group className="mb-3" controlId="formTotalMileage">
              <Form.Label>Total Mileage</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter total mileage"
                required
                value={updatedMileage}
                onChange={(e) => setUpdatedMileage(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter remarks"
                value={updatedRemarks}
                onChange={(e) => setUpdatedRemarks(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LogCard;
