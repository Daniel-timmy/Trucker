import React from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
} from "react-bootstrap";

const LogSheetsForm = ({ logsheet }) => {
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
  // grid-cell.selected = {
  //     backgroundColor: "#007bff" /* Blue line for selected time */
  // }

  return (
    <Card
      className="mx-auto mb-5"
      bg="light"
      style={{
        maxWidth: "70%",
        boxShadow: "rgb(157, 154, 154) 0px 5px 15px",
      }}
    >
      <Container>
        <h2 className="text-center mb-4">Driver's Record of Duty Status</h2>
        <Form style={{ fontSize: "0.7em" }}>
          <Row className="mx-auto d-flex align-items-center ">
            <Col md={4}>
              <Form.Group controlId="driverName">
                <Form.Label>Driver's Name:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="totalMiles">
                <Form.Label>Total Miles Driven:</Form.Label>
                <Form.Control type="number" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="date">
                <Form.Label>Date:</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="carrierName">
                <Form.Label>Carrier Name:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="carrierAddress">
                <Form.Label>Carrier Address:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="commodity">
                <Form.Label>Commodity</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="hoc">
                <Form.Label>Home Operating Center:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="vehicleNumber">
                <Form.Label>Vehicle No:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="shipper">
                <Form.Label>Trailer No</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3"></Row>

          <h4 className="mt-4">Duty Status Graph Grid</h4>
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

          <Form.Group className="mb-3" controlId="remarks">
            <Form.Label>Remarks (e.g., Location, Duty Changes):</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="signature">
            <Form.Label>Driver's Signature:</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
        </Form>
        <Button variant="success">New Entry</Button>
      </Container>
    </Card>
  );
};

export default LogSheetsForm;
