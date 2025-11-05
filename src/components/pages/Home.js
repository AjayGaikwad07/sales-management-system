import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Sales Management System</h1>
      <Row>
        <Col md={4} className="mb-4">
          <Link to="/sales-entry" className="text-decoration-none">
            <Card className="h-100">
              <Card.Body className="text-center">
                <Card.Title>New Sale</Card.Title>
                <Card.Text>Create a new sales transaction</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4} className="mb-4">
          <Link to="/sales-list" className="text-decoration-none">
            <Card className="h-100">
              <Card.Body className="text-center">
                <Card.Title>Sales Records</Card.Title>
                <Card.Text>View and manage sales history</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4} className="mb-4">
          <Link to="/shops" className="text-decoration-none">
            <Card className="h-100">
              <Card.Body className="text-center">
                <Card.Title>Shop Management</Card.Title>
                <Card.Text>Manage shop information</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
