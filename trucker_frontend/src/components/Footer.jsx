import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="Footer mt-auto" style={{ backgroundColor: "black" }}>
        <Container
          fluid
          className="footer-section"
          style={{ padding: "50px", backgroundColor: "black", color: "white" }}
        >
          <Row className="justify-content-md-center">
            <Col className="footer-logo">
              <h1>Trucker</h1>
              <div
                className="footer-socials-icons me-auto, justify-content-start"
                style={{ display: "flex", gap: "9px" }}
              >
                <FontAwesomeIcon icon={faSquareFacebook} />
                <FontAwesomeIcon icon={faTwitter} />
                <FontAwesomeIcon icon={faInstagram} />
              </div>
            </Col>
            <Col className="footer-links">
              <div className="footer-links-container">
                <ul
                  className="footer-links-list"
                  style={{
                    listStyleType: "none",
                    padding: 0,
                    fontSize: "1.2rem",
                  }}
                >
                  <li>About Us</li>
                  <li>Blog</li>
                </ul>
              </div>
            </Col>
            <Col className="footer-links">
              <div className="footer-links-container">
                <ul
                  className="footer-links-list"
                  style={{
                    listStyleType: "none",
                    padding: 0,
                    fontSize: "1.2rem",
                  }}
                >
                  <li>Support</li>
                  <li>Privacy</li>
                </ul>
              </div>
            </Col>
            <Col className="footer-button-section">
              <div className="footer-button-container">
                <Button as={Link} to="/login" className="footer-button">
                  Get Started
                </Button>
              </div>
            </Col>
          </Row>
          <div className="text-center" style={{ marginTop: "2rem" }}>
            <p>Since 2025. © Trucker. All Rights Reserved</p>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Footer;
