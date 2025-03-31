import React from "react";
import Form from "../components/Form";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Register = () => {
  return (
    <div>
      <Header />
      <Form route="register/" method="register" />
      <Footer />
    </div>
  );
};

export default Register;
