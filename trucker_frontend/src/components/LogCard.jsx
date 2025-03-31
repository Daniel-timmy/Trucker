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
import { Link } from "react-router-dom";

const LogCard = ({ logsheet, entries, trip, driver }) => {
  const [isContainerVisible, setIsContainerVisible] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [dutyStatus, setDutyStatus] = useState("off_duty");
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [errorDetails, setErrorDetails] = useState(""); // Add state for error details
  const [showUpdateModal, setShowUpdateModal] = useState(false); // State for update modal
  const [updatedMileage, setUpdatedMileage] = useState(logsheet.total_mileage); // State for total mileage
  const [updatedRemarks, setUpdatedRemarks] = useState(logsheet.remarks); // State for remarks

  const today = new Date().toISOString().split("T")[0];

  const toggleContainerVisibility = () => {
    setIsContainerVisible((prev) => !prev);
  };
  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(":");
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const roundedMinutes = Math.round(totalMinutes / 15) * 15; // Snap to nearest 15-min interval
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
    const log_id = logsheet.id; // Extract log_id from logsheet
    const trip_id = trip.id; // Extract trip_id from trip
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
        start_time: startTime,
        duty_status: dutyStatus,
        activity: activity,
        log_id: log_id,
        trip_id: trip_id, // Include trip_id in the payload
      });
    } catch (error) {
      setErrorDetails(
        error.response?.data?.details || "An unexpected error occurred."
      );
      console.log(error.response?.data?.details);
    } finally {
      // setShowOverlay(false);
    }
  };

  const tableStyles = {
    border: "1px solid black",
    textAlign: "center",
    padding: "5px",
  };

  const gridTableStyles = {
    width: "100%",
    tableLayout: "fixed",
  };

  const gridLabelStyles = {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    padding: "10px 0",
  };

  const hourCellStyles = {
    fontSize: "8px",
  };

  const gridCellStyles = {
    height: "30px",
    userSelect: "none",
    border: "1px solid black",
    backgroundImage:
      "linear-gradient(to bottom, transparent calc(50% - 2px), black, transparent calc(50% + 1px))",
  };
  const gridCellTr = {
    height: "30px",
    userSelect: "none",
    border: "1px solid black",
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

  return (
    <>
      <Card
        className="mx-auto mb-2"
        bg={isContainerVisible ? "secondary" : "light"}
        style={{ maxWidth: "80%" }}
      >
        <Card.Body
          className="d-flex justify-content-between small"
          style={{ fontSize: "0.6em" }}
        >
          <span>Date: {logsheet.date}</span>
          <span>ID: {logsheet.id}</span>
          <Button
            variant="primary"
            onClick={toggleContainerVisibility}
            style={{ fontSize: "1em" }}
          >
            {isContainerVisible ? "Hide" : "Show"} Details
          </Button>
        </Card.Body>
      </Card>
      {isContainerVisible && (
        <Card
          className=" mb-2 w-100 w-md-auto mx-auto "
          bg="light"
          style={{
            boxShadow: "rgb(157, 154, 154) 0px 5px 15px",
            width: "100%", // Ensure full width on mobile
          }}
        >
          <Container>
            <h3 className="text-center mb-2 small mx-auto">
              Driver's Record of Duty Status
            </h3>
            <div style={{ fontSize: "0.7em" }}>
              <Row className="mx-auto d-flex align-items-center ">
                <Col md={4}>
                  <div>
                    <strong>Driver's Name:</strong>
                    <span>{driver.first_name + " " + driver.last_name}</span>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <strong>Total Miles Driven:</strong>
                    <span> {logsheet.total_mileage}</span>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <strong>Date:</strong>
                    <span> {logsheet.date}</span>
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <div>
                    <strong>Carrier Name:</strong>
                    <span> {logsheet.shipper}</span>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <strong>Carrier Address:</strong>
                    <span> {trip.dropoff_location}</span>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <strong>Commodity:</strong>
                    <span> {logsheet.commodity}</span>
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <div>
                    <strong>Home Operating Center:</strong>
                    <span> {trip.home_operating_center}</span>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <strong>Vehicle No:</strong>
                    <span> {trip.vehicle_no}</span>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <strong>Trailer No:</strong>
                    <span> {trip.trailer_no}</span>
                  </div>
                </Col>
              </Row>
              <Row className="mb-1"></Row>

              <Table style={gridTableStyles} className="mb-3">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}></th>
                    <th colSpan="24">Time (24-Hour Period)</th>
                  </tr>
                  <tr>
                    <th></th>
                    <th style={hourCellStyles}>12 AM</th>
                    <th style={hourCellStyles}>1</th>
                    <th style={hourCellStyles}>2</th>
                    <th style={hourCellStyles}>3</th>
                    <th style={hourCellStyles}>4</th>
                    <th style={hourCellStyles}>5</th>
                    <th style={hourCellStyles}>6</th>
                    <th style={hourCellStyles}>7</th>
                    <th style={hourCellStyles}>8</th>
                    <th style={hourCellStyles}>9</th>
                    <th style={hourCellStyles}>10</th>
                    <th style={hourCellStyles}>11</th>
                    <th style={hourCellStyles}>12 PM</th>
                    <th style={hourCellStyles}>1</th>
                    <th style={hourCellStyles}>2</th>
                    <th style={hourCellStyles}>3</th>
                    <th style={hourCellStyles}>4</th>
                    <th style={hourCellStyles}>5</th>
                    <th style={hourCellStyles}>6</th>
                    <th style={hourCellStyles}>7</th>
                    <th style={hourCellStyles}>8</th>
                    <th style={hourCellStyles}>9</th>
                    <th style={hourCellStyles}>10</th>
                    <th style={hourCellStyles}>11</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={gridCellTr}>Off Duty</td>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <td
                        key={hour}
                        style={gridCellStyles}
                        data-hour={hour}
                        data-duty="off_duty"
                      ></td>
                    ))}
                  </tr>
                  <tr>
                    <td style={gridCellTr}>Sleeper Berth</td>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <td
                        key={hour}
                        style={gridCellStyles}
                        data-hour={hour}
                        data-duty="sleeper_berth"
                      ></td>
                    ))}
                  </tr>
                  <tr>
                    <td style={gridCellTr}>Driving</td>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <td
                        key={hour}
                        style={gridCellStyles}
                        data-hour={hour}
                        data-duty="driving"
                      ></td>
                    ))}
                  </tr>
                  <tr>
                    <td style={gridCellTr}>On Duty (Not Driving)</td>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <td
                        key={hour}
                        style={gridCellStyles}
                        data-hour={hour}
                        data-duty="on_duty"
                      ></td>
                    ))}
                  </tr>
                </tbody>
              </Table>

              <div className="mb-3">
                <strong>Remarks (e.g., Location, Duty Changes):</strong>
                <p> No remarks available.</p>
              </div>

              <div className="mb-3">
                <strong>Driver's Signature:</strong>
                <p> {driver.first_name + " " + driver.last_name}</p>
              </div>
            </div>
            {logsheet.date === today && (
              <Button variant="success" onClick={handleNewEntryClick}>
                New Entry
              </Button>
            )}
            {logsheet.date === today && (
              <Link variant="success" onClick={handleUpdateLogSheet}>
                Update Logsheet
              </Link>
            )}
          </Container>
        </Card>
      )}
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
                placeholder="Enter activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Entry
            </Button>
          </Form>
          {errorDetails && ( // Display error details if present
            <div className="mt-3 text-danger">
              <strong>Error:</strong> {errorDetails}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
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
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LogCard;
