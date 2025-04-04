import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import Header from "../components/Header";
import Footer from "../components/Footer2";
// import MapCard from "../components/Map";
import TripCard from "../components/TripCard";
import LogCard from "../components/LogCard";
import { Button, Modal, Form } from "react-bootstrap";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoadingIndicator from "../components/LoadingIndicator";
import MapComponent from "../components/MapArc";

const Dashboard = () => {
  const [id, setId] = useState("");
  const [driver, setDriver] = useState({});
  const [logsheets, setLogSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logLoading, setLogLoading] = useState(false);
  const [tripLoading, setTripLoading] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ shipper: "", commodity: "" });
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
  // arcgis AAPTxy8BH1VEsoebNVZXo8HurAx5mJ9vyrkr344PTwYgRxr5HDfd5uahvlyy6byEnX_DEbfo0riRB8iN3V8AcIlpKiVxZ_Mr6b21VNGmzBTGfBapfxeK2AeZmu9OxoWvYT3bsFf7QJJd51R5IeXi9g2YD11a8IiDgaRmtgO6pqniBvWAwL31VmEDCLW8YpGwdqhBv-5o44gyW2SkEV3jldMOMYtxuxFmBpHYP-qjGMTWINc.AT1_JNLZllBL
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    const id = currentTrip.id;
    const data = {
      shipper: formData.shipper,
      commodity: formData.commodity,
    };
    try {
      const res = await api.post(`logsheets/${id}/trips/`, data);
      getLogSheets();
      alert("Logsheet created successfully!");
    } catch (error) {
      alert(error);
    } finally {
      handleModalClose();
    }
  };

  const getLogSheets = () => {
    if (currentTrip === null) {
      return;
    }
    setLogLoading(true);

    const id = currentTrip.id;
    api
      .get(`logsheets/${id}/trips/`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setLogSheets(data.reverse());
        setLogLoading(false);
      })
      .catch((err) => alert(err))
      .finally(() => setLogLoading(false));
  };

  const getCurrentTrip = (status) => {
    setTripLoading(true);

    api
      .get(`trips/status/${status}/`)
      .then((res) => res.data)
      .then((data) => {
        setCurrentTrip(data[0]);
        setTripLoading(false);
        setId(currentTrip.id);
      })
      .catch((err) => alert(err))
      .finally(setTripLoading(false));
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
        .catch((err) => alert(err));
    }
  };

  useEffect(() => {
    getDriver();
    getCurrentTrip("in_progress");
  }, []);

  useEffect(() => {
    if (currentTrip !== undefined) {
      getLogSheets();
    }
  }, [currentTrip]);

  console.log(`${currentTrip}`);

  return (
    <>
      <Header />
      <MapComponent />
      <DashboardCard driver={driver} />
      <div className="d-flex align-items-center justify-content-between mt-5 px-5">
        <h2>Current Trip</h2>
      </div>
      <hr />
      {currentTrip === null || currentTrip === undefined ? (
        <h5 className="small">You have no current trip</h5>
      ) : tripLoading ? (
        <LoadingIndicator />
      ) : (
        <TripCard key={id} period="current" trip={currentTrip} />
      )}
      <div
        style={{ fontSize: "0.7em" }}
        className="d-flex align-items-center justify-content-between mt-5 px-5"
      >
        <h4 style={{ fontSize: "1em" }}>Logsheets for current trip</h4>

        {logsheets[0] && logsheets[0].date !== today ? (
          <Button variant="primary" onClick={handleModalShow}>
            Create LogSheet
          </Button>
        ) : logsheets.length === 0 && currentTrip ? (
          <Button variant="primary" onClick={handleModalShow}>
            Create LogSheet
          </Button>
        ) : (
          <Button variant="secondary">Create LogSheet</Button>
        )}
      </div>
      <hr />
      <div className="mb-5 ">
        {logLoading ? (
          <LoadingIndicator />
        ) : logsheets.length === 0 ? (
          <h4 className="small">You have no logsheets</h4>
        ) : (
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
      </div>

      {/* <MapCard positions={[15.505, -0.09]} /> */}
      {/* <MapCard
        start={[40.7128, -74.006]}
        end={[34.0522, -118.2437]}
        entries={tripEntries.reverse()}
        trip={currentTrip}
      /> */}
      <Footer />

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create LogSheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formShipper">
              <Form.Label>Shipper</Form.Label>
              <Form.Control
                type="text"
                name="shipper"
                required
                value={formData.shipper}
                onChange={handleInputChange}
                placeholder="Enter shipper"
              />
            </Form.Group>
            <Form.Group controlId="formCommodity" className="mt-3">
              <Form.Label>Commodity</Form.Label>
              <Form.Control
                type="text"
                name="commodity"
                required
                value={formData.commodity}
                onChange={handleInputChange}
                placeholder="Enter commodity"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Dashboard;
