import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import login_img from "../assets/login.jpg";
import { useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const RegisterForm = ({ route, method }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      if (method === "register") {
        const res = await api.post(route, {
          first_name: firstName,
          last_name: lastName,
          password: password,
          email: email,
          phone_number: phoneNumber,
        });
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        const res = await api.post(route, { password, email });
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      }
    } catch (error) {
      alert("Invalid credentials or user already exists.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {method === "register" ? (
        <Container
          fluid
          className="text-white p-5"
          style={{
            backgroundImage: `url(${login_img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "darken",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        >
          <h1 className="text-center mt-4">Welcome to Trucker</h1>
          <Row>
            <Col className="p-0">
              <Container
                className="mt-5 p-0 d-flex justify-content-center align-items-center text-center"
                style={{ height: "100vh" }}
              >
                <div>
                  <p className="fs-4 fw-bold">Welcome to your Portal!</p>
                  <p>
                    Log in to streamline your routes and ELD logs, or register
                    to optimize your hauls with precision. Keep your fleet
                    compliant and on schedule—every mile counts.
                  </p>
                </div>
              </Container>
            </Col>
            <Col className="p-0">
              <Container className="mt-5 d-flex justify-content-center align-items-center vh-100 ">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3 bg-transparent"
                        controlId="formBasicFirstName"
                      >
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          pattern="^[A-Za-z]{3,16}$"
                          required
                          className="bg-transparent text-white"
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          onInvalid={(e) =>
                            e.target.setCustomValidity(
                              "First Name must be 3-16 alphabetic characters."
                            )
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                        />
                        <Form.Text className="text-danger">
                          {firstName &&
                            !/^[A-Za-z]{3,16}$/.test(firstName) &&
                            "First Name must be 3-16 alphabetic characters."}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3 bg-transparent"
                        controlId="formBasicLastName"
                      >
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          pattern="^[A-Za-z]{3,16}$"
                          required
                          className="bg-transparent text-white"
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          onInvalid={(e) =>
                            e.target.setCustomValidity(
                              "Last Name must be 3-16 alphabetic characters."
                            )
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                        />
                        <Form.Text className="text-danger">
                          {lastName &&
                            !/^[A-Za-z]{3,16}$/.test(lastName) &&
                            "Last Name must be 3-16 alphabetic characters."}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3 bg-transparent"
                        controlId="formBasicEmail"
                      >
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          className="bg-transparent text-white"
                          type="email"
                          placeholder="Enter email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity("Invalid Email address")
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                        />
                        <Form.Text className="text-danger">
                          {email &&
                            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                              email
                            ) &&
                            "Invalid Email address"}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3 bg-transparent"
                        controlId="formBasicPhoneNumber"
                      >
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          className="bg-transparent text-white"
                          type="text"
                          placeholder="Phone Number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          pattern="^\+?[0-9]{10,15}$"
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity("Invalid phone number")
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                        />
                        <Form.Text className="text-danger">
                          {phoneNumber &&
                            !/^\+?[0-9]{10,15}$/.test(phoneNumber) &&
                            "Invalid phone number"}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3 bg-transparent"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          className="bg-transparent text-white"
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onInput={(e) => e.target.setCustomValidity("")}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3 bg-transparent"
                        controlId="formBasicConfirmPassword"
                      >
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          className="bg-transparent text-white"
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onInput={(e) => e.target.setCustomValidity("")}
                        />
                        <Form.Text className="text-danger">
                          {password !== confirmPassword &&
                            "Password do not match"}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Text className="text-white">
                    Do you have an account already?{" "}
                    <Link to="/login">Login.</Link>
                  </Form.Text>
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    {loading ? (
                      <LoadingIndicator />
                    ) : (
                      <Button variant="primary" type="submit">
                        {name}
                      </Button>
                    )}
                  </div>

                  <br />
                  {/* <div className="footer-socials-icons d-flex justify-content-evenly gap-2">
                                <FontAwesomeIcon icon={faSquareFacebook} />
                                <FontAwesomeIcon icon={faTwitter} />
                                <FontAwesomeIcon icon={faInstagram} />
                            </div> */}
                </Form>
              </Container>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container
          fluid
          className="text-white p-5"
          style={{
            backgroundImage: `url(${login_img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "darken",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        >
          <h1 className="text-center mt-4">Welcome to Trucker</h1>
          <Row>
            <Col className="p-0">
              <Container
                className="mt-5 p-0 d-flex justify-content-center align-items-center text-center"
                style={{ height: "100vh" }}
              >
                <div>
                  <p className="fs-4 fw-bold">Welcome to your Portal!</p>
                  <p>
                    Log in to streamline your routes and ELD logs, or register
                    to optimize your hauls with precision. Keep your fleet
                    compliant and on schedule—every mile counts.
                  </p>
                </div>
              </Container>
            </Col>
            <Col className="p-0">
              <Container className="mt-5 d-flex justify-content-center align-items-center vh-100 ">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3 bg-transparent"
                        controlId="formBasicEmail"
                      >
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          className="bg-transparent text-white"
                          type="email"
                          placeholder="Enter email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity("Invalid Email address")
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                        />
                        <Form.Text className="text-danger">
                          {email &&
                            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                              email
                            ) &&
                            "Invalid Email address"}
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3 bg-transparent"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          className="bg-transparent text-white"
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onInput={(e) => e.target.setCustomValidity("")}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Text className="text-white">
                    Need an account? <Link to="/register">Register.</Link>
                  </Form.Text>
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    {loading ? (
                      <LoadingIndicator />
                    ) : (
                      <Button variant="primary" type="submit">
                        {name}
                      </Button>
                    )}
                  </div>

                  <br />
                </Form>
              </Container>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default RegisterForm;
