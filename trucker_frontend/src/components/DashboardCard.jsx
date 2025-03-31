import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import placeholder from "../assets/placeholder.jpeg";

const DashboardCard = ({ driver }) => {
  const [visibleFields, setVisibleFields] = useState(3);

  useEffect(() => {
    const updateVisibleFields = () => {
      const width = window.innerWidth;
      if (width < 576) {
        setVisibleFields(3); // Small screens
      } else if (width < 768) {
        setVisibleFields(5); // Medium screens
      } else {
        setVisibleFields(8); // Large screens
      }
    };

    updateVisibleFields();
    window.addEventListener("resize", updateVisibleFields);
    return () => window.removeEventListener("resize", updateVisibleFields);
  }, []);

  const fields = [
    { label: "Full Name", value: driver.first_name + " " + driver.last_name },
    { label: "Email", value: driver.email },
    { label: "Cycle Hrs", value: driver.total_cycle_hours },
    { label: "Phone No", value: driver.phone_number },
    { label: "Driver No", value: driver.driver_number },
    { label: "Current cycle used", value: driver.current_cycle_used },
  ];

  return (
    <>
      <Card
        style={{ width: "60%", margin: "1rem" }}
        className="d-flex flex-row align-items-between justify-content-between mx-auto mb-5"
      >
        <Card.Img src={placeholder} style={{ width: "15%" }}></Card.Img>
        <Card.Body className="d-flex justify-content-between">
          {fields.slice(0, visibleFields).map((field, index) => (
            <div key={index}>
              <h6 className="small" style={{ fontSize: "0.7em" }}>
                {field.label}:
              </h6>
              <h6 style={{ fontSize: "0.7em" }}>{field.value}</h6>
            </div>
          ))}
        </Card.Body>
      </Card>
    </>
  );
};

export default DashboardCard;
