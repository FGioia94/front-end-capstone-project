import { useState } from "react";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../../store/slices/userSlice";
import { useNavigate, Link } from "react-router";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "./Login.css";

const Login = () => {
  /*
  * This component handles user login functionality. It verifies user credentials
  * against stored data in localStorage and manages login state
  * using Redux. Upon successful login, it redirects the user to the home page.
  *
  * @returns {JSX.Element} The login form component.
  */

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate input fields
    if (!username.trim() || !password.trim()) {
      setError("Please fill all fields");
      setSuccess("");
      return;
    }
    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setSuccess("");
      return;
    }

    // Check credentials from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const userData = users[username];
    
    // Validate user existence and password matcha
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
    dispatch(loginAction({ username, role: userData.role }));
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