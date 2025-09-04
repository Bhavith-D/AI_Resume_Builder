import React from "react";
import { Card, Row, Col } from "react-bootstrap";

function About() {
  return (
    <Row className="justify-content-center align-items-center flex-grow-1">
      <Col xs={12} md={8} lg={6}>
        <Card
          className="shadow-lg border-0 rounded-4 p-4 p-md-5"
          style={{ backgroundColor: "#F2EBE5" }}
        >
          <Card.Body>
            <h2 className="text-center fw-bold mb-4 text-dark">About This Website</h2>
            <p className="lead text-center">
              Welcome to the **AI Resume Builder**! 🤖
            </p>
            <p>
              This web application is designed to help you create a highly
              tailored resume for any job. By using the power of AI, it analyzes
              the job description you provide and optimizes your existing resume
              to highlight the most relevant skills and experiences.
            </p>
            <p>
              Simply paste the job description, upload your resume,
              provide your Gemini API key, and let the AI do the rest. The goal is
              to increase your chances of getting noticed by recruiters and Applicant
              Tracking Systems (ATS).
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default About;