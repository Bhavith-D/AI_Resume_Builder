import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

function Account() {
  const [apiKey, setApiKey] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem("apiKey");
    const savedResumeName = localStorage.getItem("resumeFileName");
    if (savedKey) setApiKey(savedKey);
    if (savedResumeName) setResumeFileName(savedResumeName);
  }, []);

  const handleSave = () => {
    setSuccess("");
    setError("");

    if (apiKey.trim()) {
      localStorage.setItem("apiKey", apiKey);
      setSuccess("API Key saved successfully!");
    } else {
      setError("Please enter a valid API key.");
    }
  };

  const handleResumeUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setResumeFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      // Store as Base64 (can be large!)
      localStorage.setItem("resumeFile", reader.result);
      localStorage.setItem("resumeFileName", file.name);
      setSuccess(`Resume "${file.name}" uploaded successfully!`);
    };
    reader.readAsDataURL(file); // works for pdf/docx/json
  } else {
    setResumeFileName("");
    localStorage.removeItem("resumeFileName");
    localStorage.removeItem("resumeFile");
  }
};

  return (
    <Row className="justify-content-center align-items-center flex-grow-1">
      <Col xs={12} md={8} lg={6}>
        <Card
          className="shadow-lg border-0 rounded-4 p-4 p-md-5"
          style={{ backgroundColor: "#F2EBE5" }}
        >
          <Card.Body>
            <h2 className="text-center fw-bold mb-4 text-dark">Your Account</h2>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Form.Group className="mb-4">
                <Form.Label>Google Gemini API Key</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Your key is stored locally in your browser.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Upload Resume</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf, .doc, .docx"
                  onChange={handleResumeUpload}
                />
              </Form.Group>

              {resumeFileName && (
                <div className="mb-3">
                  <p className="fw-bold">Current Resume:</p>
                  <p>{resumeFileName} (Uploaded)</p>
                </div>
              )}

              <Button
                className="w-100 py-2 fw-bold"
                variant="primary"
                onClick={handleSave}
                style={{
                  backgroundColor: "#6A453A",
                  borderColor: "#6A453A",
                }}
              >
                Save Settings
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Account;