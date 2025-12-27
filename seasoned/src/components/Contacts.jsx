import { useState } from "react";
import "./Contacts.css";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [tos, setTos] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_MESSAGE_LENGTH = 500;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
    }

    if (!tos) {
      newErrors.tos = "You must agree to the Terms of Service";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess("");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Simulate API call
    setTimeout(() => {
      setSuccess(
        "Thanks! We've received your message and will respond as soon as possible."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTos(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const messageCharsLeft = MAX_MESSAGE_LENGTH - formData.message.length;
  const messageProgress = (formData.message.length / MAX_MESSAGE_LENGTH) * 100;

  return (
    <div className="contacts-wrapper">
      <div className="contacts-header">
        <h1 className="contacts-title">Get In Touch</h1>
        <p className="contacts-subtitle">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="contacts-content">
        <div className="contact-form-card">
          <h2 className="contact-form-title">📬 Send us a Message</h2>

          {success && (
            <div className="contact-alert success">
              ✓ {success}
            </div>
          )}

          {Object.keys(errors).length > 0 && !success && (
            <div className="contact-alert error">
              ⚠ Please fix the errors below
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="contact-form-group">
              <label className="contact-form-label" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`contact-form-input ${errors.name ? "error" : ""}`}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div style={{ color: "#fca5a5", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  {errors.name}
                </div>
              )}
            </div>

            <div className="contact-form-group">
              <label className="contact-form-label" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`contact-form-input ${errors.email ? "error" : ""}`}
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div style={{ color: "#fca5a5", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div className="contact-form-group">
              <label className="contact-form-label" htmlFor="subject">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className={`contact-form-input ${errors.subject ? "error" : ""}`}
                placeholder="What's this about?"
                value={formData.subject}
                onChange={handleChange}
              />
              {errors.subject && (
                <div style={{ color: "#fca5a5", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  {errors.subject}
                </div>
              )}
            </div>

            <div className="contact-form-group">
              <label className="contact-form-label" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className={`contact-form-textarea ${errors.message ? "error" : ""}`}
                placeholder="Tell us more..."
                value={formData.message}
                onChange={handleChange}
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <div
                className={`character-count ${
                  messageProgress > 90
                    ? "limit"
                    : messageProgress > 75
                    ? "warning"
                    : ""
                }`}
              >
                {messageCharsLeft} characters remaining
              </div>
              {errors.message && (
                <div style={{ color: "#fca5a5", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  {errors.message}
                </div>
              )}
            </div>

            <div className="contact-form-checkbox">
              <input
                type="checkbox"
                id="tos"
                checked={tos}
                onChange={(e) => {
                  setTos(e.target.checked);
                  if (errors.tos) {
                    setErrors((prev) => ({ ...prev, tos: "" }));
                  }
                }}
              />
              <label htmlFor="tos">
                I agree to the{" "}
                <a href="/tos" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>
              </label>
            </div>
            {errors.tos && (
              <div style={{ color: "#fca5a5", fontSize: "0.85rem", marginTop: "-0.75rem", marginBottom: "1rem" }}>
                {errors.tos}
              </div>
            )}

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="contact-info-card">
          <div className="contact-info-section">
            <h3 className="contact-info-title">
              <span className="contact-info-title-icon">🏢</span>
              Office Location
            </h3>
            <div className="contact-info-item">
              <span className="contact-info-icon">📍</span>
              <span className="contact-info-text">
                21A, Commerce Street<br />
                44126 NotAnEcommerceClone HQ
              </span>
            </div>
          </div>

          <div className="contact-info-section">
            <h3 className="contact-info-title">
              <span className="contact-info-title-icon">💬</span>
              Contact Details
            </h3>
            <div className="contact-info-item">
              <span className="contact-info-icon">📞</span>
              <span className="contact-info-text">
                <a href="tel:+00012345678">+00 01 234 567 89</a>
              </span>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-icon">📧</span>
              <span className="contact-info-text">
                <a href="mailto:info@notanecommerceclone.com">info@notanecommerceclone.com</a>
              </span>
            </div>
          </div>

          <div className="contact-info-section">
            <h3 className="contact-info-title">
              <span className="contact-info-title-icon">⏰</span>
              Business Hours
            </h3>
            <div className="contact-info-item">
              <span className="contact-info-icon">🗓️</span>
              <span className="contact-info-text">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;