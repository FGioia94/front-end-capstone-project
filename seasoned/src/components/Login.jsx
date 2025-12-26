import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill all the fields");
      setSuccess("");
      return;
    }

    const storedUser = localStorage.getItem(email);

    if (storedUser === null) {
      setError("User doesn't exist, please register first");
      setSuccess("");
      return;
    }

    const userData = JSON.parse(storedUser);

    if (userData.password !== password) {
      setError("Wrong Password");
      setSuccess("");
      return;
    }

    // Login successful
    sessionStorage.setItem("isLoggedIn", email);
    sessionStorage.setItem("isAdmin", userData.isAdmin);

    setError("");
    setSuccess(
      `Logged in as ${userData.isAdmin ? "ADMIN" : "USER"}! Redirecting...`
    );

    setTimeout(() => {
      if (userData.isAdmin) {
        navigate(`/admin-dashboard?user=${email}`);
      } else {
        navigate(`/dashboard?user=${email}`);
      }
    }, 1500);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="mb-4 text-center">Login</h1>

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

            <Form.Group className="mb-4" controlId="passwordField">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>

            <p className="mt-3 text-center">
              Not subscribed yet? <Link to="/register">Sign In</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;