import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import hero from "../assets/hero.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <Container
        fluid
        className="hero-section"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="hero-text, text-center">
          <h1>Welcome to Trucker!</h1>
          <p>Your all-in-one platform for your logistics needs.</p>
          <Button as={Link} to="/login" variant="dark">
            Get Started
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Hero;
