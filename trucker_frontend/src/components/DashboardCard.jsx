import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import placeholder from "../assets/placeholder.jpeg";

const DashboardCard = ({ driver }) => {
  const [visibleFields, setVisibleFields] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleFields(3); // Mobile
      } else if (window.innerWidth < 992) {
        setVisibleFields(4); // Tablet
      } else {
        setVisibleFields(10); // Desktop
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fields = [
    { label: "Full Name", value: driver.first_name + " " + driver.last_name },
    { label: "Email", value: driver.email },
    { label: "Cycle Hrs/8days", value: driver.cycle_hours },
    { label: "Phone No", value: driver.phone_number },
    { label: "Driver No", value: driver.driver_number },
    { label: "Current cycle used", value: driver.current_cycle_used },
    { label: "Total mileage", value: driver.total_mileage },
    { label: "Total On duty time", value: driver.total_on_duty_time },
    { label: "Total Driving time", value: driver.total_driving_time },
  ];
  console.log(driver);

  return (
    <Card
      className="mb-4 mx-auto"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "1rem auto",
      }}
    >
      <Row className="g-0">
        <Col xs={4} md={3} lg={2}>
          <Card.Img
            src={placeholder}
            className="img-fluid h-100"
            style={{ objectFit: "cover" }}
          />
        </Col>
        <Col xs={8} md={9} lg={10}>
          <Card.Body className="p-3">
            <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
              {fields.slice(0, visibleFields).map((field, index) => (
                <Col key={index}>
                  <div className="text-truncate">
                    <h6
                      className="small mb-1"
                      style={{
                        fontSize: "clamp(0.6rem, 2vw, 0.9rem)",
                        color: "#700",
                      }}
                    >
                      {field.label}:
                    </h6>
                    <h6
                      style={{
                        fontSize: "clamp(0.6rem, 2vw, 0.9rem)",
                        wordBreak: "break-word",
                      }}
                    >
                      {field.value}
                    </h6>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default DashboardCard;
