import React from 'react'
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'


const TripCard = ({period, trip:{id, current_location, pickup_location, dropoff_location,
  home_operating_center, start_date, end_date, status, vehicle_no, trailer_no
}, trip}) => {
  console.log(trip)

  return (
    <>
      <Card
        body
        border="dark"
        className="mx-auto mb-5 text-white"
        bg='dark'
        style={{ boxShadow: 'rgb(157, 154, 154) 0px 5px 15px', maxWidth: '70%' }}
      >
        <Container className="align-items-center" style={{ fontSize: '0.7rem' }}>
        <Card.Header className='d-flex align-items-start'><h6 className='small'>Trip ID:{id}</h6></Card.Header>
          <Row xs={3} lg={4}>
            <Col>
              <h6 className="small">Pickup Location:</h6>
              <hr />
              <h6>{pickup_location}</h6>
            </Col>
            <Col>
              <h6 className="small">Dropoff Location:</h6>
              <hr />
              <h6 >{dropoff_location}</h6>
            </Col>
            <Col>
              <h6 className="small">Current Location:</h6>
              <hr />
              <h6>{current_location}</h6>
            </Col>
            <Col>
              <h6 className="small">H.O.C:</h6>
              <hr />
              <h6 >{home_operating_center}</h6>
            </Col>
            <Col>
              <h6 className="small">Start Date:</h6>
              <hr />
              <h6 >{start_date}</h6>
            </Col>
            <Col>
              <h6 className="small">End Date:</h6>
              <hr />
              <h6>{end_date}</h6>
            </Col>
          
            <Col>
              <h6 className="small">Status:</h6>
              <hr />
              <h6 >{status}</h6>
            </Col>
            <Col>
              <h6 className="small">Vehicle No:</h6>
              <hr />
              <h6 >{vehicle_no}</h6>
            </Col>
            <Col>
              <h6 className="small">Trailer No:</h6>
              <hr />
              <h6 >{trailer_no}</h6>
              <Form.Select id="status" defaultValue="Pending">
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </Form.Select>
            </Col>
          </Row>
          <hr />
          <Row xs={3}>
            {period === 'current' &&  <Col>
              <Link id="overlay-shipping-button" type='btn' to={`/trips/${id}`}  state={{ trip }} variant="dark">
                Update Info
              </Link>
            </Col> }
           
            <Col>
              <Button variant="outline-light">
                View LogSheets
              </Button>
            </Col>
          </Row>
        </Container>
      </Card>
    </>
  )
}

export default TripCard