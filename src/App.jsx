import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure this is imported for styles

function App() {
  const [jobDesc, setJobDesc] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Load saved data from localStorage on initial render
  useEffect(() => {
    const savedDesc = localStorage.getItem("jobDesc");
    const savedKey = localStorage.getItem("apiKey");
    if (savedDesc) setJobDesc(savedDesc);
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleGenerate = async () => {
    // Clear any previous alerts
    setError("");
    setSuccess("");

    // --- Input Validation ---
    if (!jobDesc.trim()) {
      setError("Job Description is required. Please paste it in.");
      return;
    }
    if (!resumeFile) {
      setError("Please upload your Resume in JSON format.");
      return;
    }
    if (!apiKey.trim()) {
      setError("A Google Gemini API Key is required to generate the resume.");
      return;
    }

    try {
      setLoading(true);
      // Save data to localStorage for convenience
      localStorage.setItem("jobDesc", jobDesc);
      localStorage.setItem("apiKey", apiKey);

      const formData = new FormData();
      formData.append("job_description", jobDesc);
      formData.append("api_key", apiKey);
      formData.append("resume", resumeFile);

      // --- Step 1: Generate Resume on the backend ---
      const generateResponse = await fetch("http://localhost:8000/generate_resume/", {
        method: "POST",
        body: formData,
      });

      if (!generateResponse.ok) {
        throw new Error(`Generation failed with status: ${generateResponse.status}`);
      }

      // --- Step 2: Download the generated PDF from the backend ---
      const downloadResponse = await fetch("http://localhost:8000/download_resume/");

      if (!downloadResponse.ok) {
        throw new Error(`Download failed with status: ${downloadResponse.status}`);
      }

      const blob = await downloadResponse.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      setSuccess("Resume generated successfully! 🎉 Your tailored resume is ready to preview.");
    } catch (error) {
      console.error("Error generating resume:", error);
      setError(`An error occurred: ${error.message}. Please check your inputs and try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        {/* Left side: Form takes 6 columns on large screens */}
        <Col xs={12} lg={6} className="d-flex justify-content-center">
          <Card className="shadow-lg border-0 rounded-4 p-4 p-md-5 w-100">
            <Card.Body>
              <h2 className="mb-2 text-center fw-bold">AI Resume Builder 🤖</h2>
              <p className="text-muted text-center mb-4">
                Tailor your resume to any job description using the power of AI.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form>
                {/* Job Description Input */}
                <Form.Group className="mb-3">
                  <Form.Label>Job Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Paste the job description here..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </Form.Group>

                {/* Resume File Upload */}
                <Form.Group className="mb-3">
                  <Form.Label>Upload Resume (JSON format)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".json"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                </Form.Group>

                {/* API Key Input */}
                <Form.Group className="mb-4">
                  <Form.Label>Google Gemini API Key</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </Form.Group>

                {/* Generate Button */}
                <Button
                  className="mt-2 w-100 py-2 fw-bold"
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Generating Resume...
                    </>
                  ) : (
                    "Generate Resume"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Right side: Conditional content */}
        <Col xs={12} lg={6} className="d-flex align-items-center justify-content-center">
          {previewUrl ? (
            <Card className="shadow-lg border-0 rounded-4 p-4 p-md-5 w-100">
              <Card.Body>
                <h4 className="text-center fw-bold mb-3">Resume Preview</h4>
                <iframe
                  src={previewUrl}
                  title="Resume Preview"
                  width="100%"
                  height="500px"
                  style={{ border: "1px solid #dee2e6", borderRadius: "8px" }}
                />
                <Button
                  className="mt-3 w-100 fw-bold"
                  variant="success"
                  href={previewUrl}
                  download="resume.pdf"
                >
                  Download Resume
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <div className="text-center text-muted p-5 d-none d-lg-block">
              <h4 className="fw-bold">Your Resume Preview will appear here.</h4>
              <p>
                Once you generate your resume, a tailored PDF preview will be displayed .
              </p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;