import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  return (
    <Row className="justify-content-center align-items-center flex-grow-1">
      <Col xs={12} md={8} lg={6}>
        <Card
          className="shadow-lg border-0 rounded-4 p-4 p-md-5"
          style={{ backgroundColor: "#F2EBE5" }}
        >
          <Card.Body>
            <h2 className="text-center fw-bold mb-4 text-dark">Contact Us</h2>
            <p className="text-center text-muted mb-4">
              Feel free to reach out to us with any questions or feedback.
            </p>
            <ul className="list-unstyled">
              <li className="d-flex align-items-center mb-3">
                <FaEnvelope className="me-3 text-secondary" size={24} />
                <a href="mailto:contact@example.com" className="text-decoration-none text-dark">
                  contact@example.com
                </a>
              </li>
              <li className="d-flex align-items-center mb-3">
                <FaPhone className="me-3 text-secondary" size={24} />
                <span className="text-dark">(555) 123-4567</span>
              </li>
              <li className="d-flex align-items-center">
                <FaMapMarkerAlt className="me-3 text-secondary" size={24} />
                <span className="text-dark">123 AI Street, Tech City, 12345</span>
              </li>
            </ul>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Contact;