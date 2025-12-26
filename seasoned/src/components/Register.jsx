import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password || !confirm) {
      setError("Please fill all the fields");
      setSuccess("");
      return;
    }

    if (localStorage.getItem(email) !== null) {
      setError("User already exists");
      setSuccess("");
      return;
    }

    if (password !== confirm) {
      setError("Passwords don't match");
      setSuccess("");
      return;
    }

    // Save user object instead of just password
    const userData = {
      password,
      isAdmin, // <-- HERE
    };

    localStorage.setItem(email, JSON.stringify(userData));

    setError("");
    setSuccess(
      `Registration complete! You are registered as ${isAdmin ? "ADMIN" : "USER"}. Redirecting...`
    );

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="mb-4 text-center">Sign In</h1>

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

            <Form.Group className="mb-3" controlId="passwordField">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPasswordField">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </Form.Group>

            {/* ADMIN CHECKBOX */}
            <Form.Group className="mb-4" controlId="adminCheckbox">
              <Form.Check
                type="checkbox"
                label="Register as Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;