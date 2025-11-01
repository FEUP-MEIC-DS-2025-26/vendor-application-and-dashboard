import React, { useState } from "react";

interface VendorRegisterProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface Question {
  question_id: string;
  question_text: string;
  answer: string;
}

const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "bold", color: "#1a1a1a", fontSize: "1em" };

const VERIFICATION_QUESTIONS = [
  {
    id: "delivery_method",
    text: "How do you deliver your products to customers?",
    placeholder: "e.g., Mail service, local delivery, courier..."
  },
  {
    id: "physical_store",
    text: "Do you have a physical store? If so, where?",
    placeholder: "e.g., Yes, in Porto / No, online only."
  },
  {
    id: "packaging",
    text: "How do you package your products?",
    placeholder: "e.g., Recyclable packaging, custom boxes..."
  },
  {
    id: "return_policy",
    text: "What is your return policy?",
    placeholder: "e.g., 14 days for return, full refund..."
  },
  {
    id: "production_capacity",
    text: "How many products can you produce per month?",
    placeholder: "e.g., 50 units, made to order..."
  }
];

function VendorRegister({ onSuccess, onCancel }: VendorRegisterProps) {
  const [formData, setFormData] = useState({
    name: "",
    owner_name: "",
    email: "",
    phone: "",
    country: "",
    tax_id: "",
    website: "",
    about: "",
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return "Store name is required";
    if (!formData.owner_name.trim()) return "Owner name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Invalid email";
    
    // Check all questions are answered
    for (const question of VERIFICATION_QUESTIONS) {
      if (!answers[question.id] || answers[question.id].trim().length < 10) {
        return `Please answer the question: "${question.text}" (minimum 10 characters)`;
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Format questions for API
      const questions: Question[] = VERIFICATION_QUESTIONS.map(q => ({
        question_id: q.id,
        question_text: q.text,
        answer: answers[q.id]
      }));

      const payload = {
        ...formData,
        questions
      };

      console.log("Submitting vendor registration:", payload);

      const response = await fetch("http://localhost:8000/api/vendors/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      console.log("Registration successful:", data);
      setSuccess(true);
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Error submitting registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container register-success">
        <div className="register-card">
          <h2 className="register-success-title">✓ Registration Submitted Successfully!</h2>
          <p className="register-success-message">
            Your registration request has been received and will be reviewed by our team.
          </p>
          <p className="register-success-detail">
            You will receive an email shortly with the verification result.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container register-container">
      <header className="register-header">
        <h1 className="register-title">Vendor Registration</h1>
        <p className="register-subtitle">
          Fill out the form below to register as an artisan seller
        </p>
      </header>

      {error && (
        <div className="register-error">
          <span className="register-error-icon">⚠️</span> {error}
        </div>
      )}

      <form className="register-form" onSubmit={handleSubmit}>
        {/* Store Information */}
        <section className="register-section">
          <h2 className="register-section-title">📍 Store Information</h2>
          <div className="register-field">
            <label className="register-label">Store Name / Brand *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Artisan Crafts Co."
              required
              className="register-input"
            />
          </div>
          <div className="register-field">
            <label className="register-label">Website (optional)</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://www.example.com"
              className="register-input"
            />
          </div>
          <div className="register-field">
            <label className="register-label">Store Description (optional)</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Briefly describe your store and products..."
              rows={3}
              className="register-textarea"
            />
          </div>
        </section>

        {/* Contact Information */}
        <section className="register-section">
          <h2 className="register-section-title">👤 Contact Information</h2>
          <div className="register-field">
            <label className="register-label">Owner Name *</label>
            <input
              type="text"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
              className="register-input"
            />
          </div>
          <div className="register-row">
            <div className="register-field">
              <label className="register-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                className="register-input"
              />
            </div>
            <div className="register-field">
              <label className="register-label">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+351 912 345 678"
                className="register-input"
              />
            </div>
          </div>
          <div className="register-row">
            <div className="register-field">
              <label className="register-label">Country (optional)</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Portugal"
                className="register-input"
              />
            </div>
            <div className="register-field">
              <label className="register-label">Tax ID (optional)</label>
              <input
                type="text"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleInputChange}
                placeholder="123456789"
                className="register-input"
              />
            </div>
          </div>
        </section>

        {/* Verification Questions */}
        <section className="register-section">
          <h2 className="register-section-title">✅ Verification Questions</h2>
          <p className="register-section-desc">
            Please answer the following questions to help our team verify your profile.
          </p>
          {VERIFICATION_QUESTIONS.map((question, index) => (
            <div key={question.id} className="register-field">
              <label className="register-label">
                {index + 1}. {question.text} *
              </label>
              <textarea
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder={question.placeholder}
                rows={3}
                required
                className="register-textarea"
              />
              <small className="register-hint">Minimum 10 characters</small>
            </div>
          ))}
        </section>

        {/* Submit Buttons */}
        <div className="register-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="register-btn cancel-btn"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="register-btn submit-btn"
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
      </form>

      <footer className="register-footer">
        <p>By submitting this form, you agree to our terms and conditions.</p>
      </footer>
    </div>
  );
}

export default VendorRegister;
