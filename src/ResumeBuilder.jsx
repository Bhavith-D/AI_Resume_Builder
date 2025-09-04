import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function ResumeBuilder() {
  const [jobDesc, setJobDesc] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [resumeFileName, setResumeFileName] = useState(null);

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedDesc = localStorage.getItem("jobDesc");
    const savedKey = localStorage.getItem("apiKey");
    const savedResumeName = localStorage.getItem("resumeFileName");

    if (savedDesc) setJobDesc(savedDesc);
    if (savedKey) setApiKey(savedKey);
    if (savedResumeName) setResumeFileName(savedResumeName);
  }, []);

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mimeType });
  };

  const handleGenerate = async () => {
    setError("");
    setSuccess("");

    const currentApiKey = localStorage.getItem("apiKey");
    const resumeBase64 = localStorage.getItem("resumeFile");
    const currentResumeName = localStorage.getItem("resumeFileName");

    if (!jobDesc.trim()) {
      setError("Job Description is required. Please paste it in.");
      return;
    }
    if (!resumeBase64 || !currentResumeName) {
      setError("Please upload your Resume in the Account section.");
      return;
    }
    if (!currentApiKey) {
      setError("A Google Gemini API Key is required. Please enter it in the Account section.");
      return;
    }

    try {
      setLoading(true);
      localStorage.setItem("jobDesc", jobDesc);

      // Extract MIME type from Base64 string
      const mimeType = resumeBase64.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
      const resumeBlob = base64ToBlob(resumeBase64, mimeType);

      const formData = new FormData();
      formData.append("job_description", jobDesc);
      formData.append("api_key", currentApiKey);
      formData.append("resume", resumeBlob, currentResumeName);

      // Step 1: Generate Resume on the backend
      const generateResponse = await fetch("http://localhost:8000/generate_resume/", {
        method: "POST",
        body: formData,
      });

      if (!generateResponse.ok) {
        throw new Error(`Generation failed with status: ${generateResponse.status}`);
      }

      // Step 2: Download the generated PDF from the backend
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
    <Row className="justify-content-center flex-grow-1">
      {/* Left side: Job Description Input */}
      <Col xs={12} lg={5} className="d-flex justify-content-center p-3 p-md-5">
        <Card className="shadow-lg border-0 rounded-4 w-100" style={{ backgroundColor: "#F2EBE5", border: "1px solid #D5C9B8" }}>
          <Card.Body className="p-4 p-md-5">
            <h2 className="mb-2 text-center fw-bold text-dark">Paste Job Description</h2>
            <p className="text-muted text-center mb-4">Paste the full job description here to optimize your resume</p>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={10}
                  placeholder="Paste the job description here..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#C4B8A9" }}
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      {/* Right side: Optimized Resume Preview */}
      <Col xs={12} lg={5} className="d-flex justify-content-center p-3 p-md-5">
        <Card className="shadow-lg border-0 rounded-4 w-100" style={{ backgroundColor: "#F2EBE5", border: "1px solid #D5C9B8" }}>
          <Card.Body className="p-4 p-md-5">
            <h2 className="mb-2 text-center fw-bold text-dark">Optimized Resume Preview</h2>
            <div className="text-center text-muted p-5">
              {previewUrl ? (
                <>
                  <iframe src={previewUrl} title="Resume Preview" width="100%" height="500px" style={{ border: "1px solid #dee2e6", borderRadius: "8px" }} />
                  <Button
                    className="mt-3 w-100 fw-bold"
                    variant="success"
                    href={previewUrl}
                    download="resume.pdf"
                  >
                    Download Resume
                  </Button>
                </>
              ) : (
                <div className="p-5 d-none d-lg-block" style={{ minHeight: "500px" }}>
                  <h4 className="fw-bold">Your Optimized Resume Preview will appear here.</h4>
                  <p>Once you generate your resume, a tailored PDF preview will be displayed.</p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Row className="w-100">
        <Col className="d-flex justify-content-center p-3">
          <Button
            className="w-50 py-3 fw-bold"
            style={{ backgroundColor: "#6A453A", borderColor: "#6A453A", borderRadius: "2rem" }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                Generating Resume...
              </>
            ) : (
              "Generate Optimized Resume"
            )}
          </Button>
        </Col>
      </Row>
    </Row>
  );
}

export default ResumeBuilder;