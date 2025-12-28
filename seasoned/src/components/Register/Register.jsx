import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../../store/slices/userSlice";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username || !password || !confirm) {
      setError("Please fill all the fields");
      setSuccess("");
      return;
    }

    if (password !== confirm) {
      setError("Passwords don't match");
      setSuccess("");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setSuccess("");
      return;
    }

    // Save user to localStorage
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    
    if (users[username]) {
      setError("Username already exists");
      setSuccess("");
      return;
    }
    
    users[username] = {
      password: password,
      role: isAdmin ? "admin" : "user"
    };
    
    localStorage.setItem("users", JSON.stringify(users));

    setError("");
    setSuccess("Registration complete! Redirecting to login...");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="text-center">Create Account</h1>
        <p className="register-subtitle">Join Not an Ecommerce clone today</p>

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

            <Form.Group className="mb-3" controlId="confirmPasswordField">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3 register-admin-checkbox" controlId="adminCheckbox">
              <Form.Check
                type="checkbox"
                label="Register as Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Form.Group>

            <Button type="submit" className="w-100 register-submit-btn">
              Register
            </Button>

            <p className="register-footer text-center">
              Already have an account? <Link to="/login" className="register-link">Log In</Link>
            </p>
          </Form>
        </div>
      </div>
  );
};

export default Register;