import Container from "react-bootstrap/Container";

const Footer = () => {
  return (
    <>
      <div className="Footer mt-auto" style={{ backgroundColor: "black" }}>
        <Container
          fluid
          className="footer-section"
          style={{ padding: "50px", backgroundColor: "black", color: "white" }}
        >
          <div className="text-center" style={{ marginTop: "2rem" }}>
            <p>Since 2025. © Trucker. All Rights Reserved</p>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Footer;
