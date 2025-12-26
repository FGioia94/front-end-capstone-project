import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const Contacts = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tos, setTos] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !subject || !message) {
      setError("Please fill all the fields");
      setSuccess("");
      return;
    }

    if (!tos) {
      setError("You should agree with our Terms of Service first");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess(
      "Thanks, we have received your message and will answer your question as soon as possible"
    );
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="mb-4">Contact Us</h1>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="emailField">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="subjectField">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="messageField">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="tosCheckbox">
              <Form.Check
                type="checkbox"
                label={
                  <>
                    I agree to the{" "}
                    <a href="/tos" target="_blank" rel="noopener noreferrer">
                      terms of service
                    </a>
                  </>
                }
                checked={tos}
                onChange={(e) => setTos(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        </Col>

        <Col md={4} className="mt-5">
          <h2>Pokemon Arena Ltd</h2>
          <p>21A, Pikachu rd. 44126 Pokemon Town</p>
          <p>+00 01 234 567 89</p>
          <p>info@pokemonarena.com</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Contacts;