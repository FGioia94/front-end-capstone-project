import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please fill all fields");
      setSuccess("");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setSuccess("");
      return;
    }

    // Check credentials from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const userData = users[username];
    
    if (!userData) {
      setError("Invalid username or password");
      setSuccess("");
      return;
    }
    
    if (userData.password !== password) {
      setError("Invalid username or password");
      setSuccess("");
      return;
    }

    // Login with automatic role detection
    login(username, userData.role);
    setError("");
    setSuccess(`Logged in successfully as ${userData.role}! Redirecting...`);

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="text-center">Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue to Not an Ecommerce clone</p>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="usernameField">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            <Button type="submit" className="w-100 login-submit-btn">
              Login
            </Button>

            <p className="login-footer text-center">
              Not subscribed yet? <Link to="/register" className="login-link">Sign Up</Link>
            </p>
          </Form>
        </div>
      </div>
  );
};

export default Login;