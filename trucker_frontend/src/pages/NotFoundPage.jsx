import Header from "../components/Header";
import Footer from "../components/Footer";
import React from "react";
import Container from "react-bootstrap/Container";
import notfound from "../assets/notfound.jpg";

const NotFoundPage = () => {
  return (
    <>
      <Header />
      <Container
        fluid
        className="text-white mt-5 p-0 d-flex justify-content-center align-items-center text-center"
        style={{
          backgroundImage: `url(${notfound})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          height: "100vh",
        }}
      >
        <div>
          <p className="fs-1 fw-bold">Page Not Found</p>
          <p>The page you are looking for is not available.</p>
        </div>
      </Container>
    </>
  );
};

export default NotFoundPage;
