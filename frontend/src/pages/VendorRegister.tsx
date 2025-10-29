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
      <div className="container" style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
        <div style={{ 
          padding: "40px", 
          background: "#e8f5e9", 
          borderRadius: "8px",
          border: "2px solid #4caf50"
        }}>
          <h2 style={{ color: "#2e7d32", marginBottom: "20px" }}>✓ Registration Submitted Successfully!</h2>
          <p style={{ fontSize: "1.1em", marginBottom: "10px" }}>
            Your registration request has been received and will be reviewed by our team.
          </p>
          <p style={{ color: "#666" }}>
            You will receive an email shortly with the verification result.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "800px", margin: "20px auto" }}>
      <header style={{ marginBottom: "30px", textAlign: "center" }}>
        <h1>Vendor Registration</h1>
        <p style={{ color: "#666", fontSize: "1.1em" }}>
          Fill out the form below to register as an artisan seller
        </p>
      </header>

      {error && (
        <div style={{ 
          padding: "15px", 
          background: "#ffebee", 
          color: "#c62828",
          borderRadius: "4px",
          marginBottom: "20px",
          border: "1px solid #ef5350"
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Store Information */}
        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>
            📍 Store Information
          </h2>
          
          <div style={{ marginTop: "20px" }}>
            <label style={labelStyle}>
              Store Name / Brand *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Artisan Crafts Co."
              required
              style={{ width: "100%", padding: "10px", fontSize: "1em", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginTop: "15px" }}>
            <label style={labelStyle}>
              Website (optional)
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://www.example.com"
              style={{ width: "100%", padding: "10px", fontSize: "1em", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginTop: "15px" }}>
            <label style={labelStyle}>
              Store Description (optional)
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Briefly describe your store and products..."
              rows={3}
              style={{ width: "100%", padding: "10px", fontSize: "1em", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
        </section>

        {/* Contact Information */}
        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>
            👤 Contact Information
          </h2>
          
          <div style={{ marginTop: "20px" }}>
            <label style={labelStyle}>
              Owner Name *
            </label>
            <input
              type="text"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
              style={{ width: "100%", padding: "10px", fontSize: "1em", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div>
              <label style={labelStyle}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                style={{ width: "100%", padding: "10px", fontSize: "1em", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Phone (optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+351 912 345 678"
                style={{ width: "100%", padding: "10px", fontSize: "1em", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
          </div>

          <div style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div>
              <label style={labelStyle}>
                Country (optional)
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Portugal"
                style={{ width: "100%", padding: "10px", fontSize: "1em", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Tax ID (optional)
              </label>
              <input
                type="text"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleInputChange}
                placeholder="123456789"
                style={{ width: "100%", padding: "10px", fontSize: "1em", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
          </div>
        </section>

        {/* Verification Questions */}
        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>
            ✅ Verification Questions
          </h2>
          <p style={{ color: "#666", marginTop: "10px", marginBottom: "20px" }}>
            Please answer the following questions to help our team verify your profile.
          </p>

          {VERIFICATION_QUESTIONS.map((question, index) => (
            <div key={question.id} style={{ marginTop: "20px" }}>
              <label style={labelStyle}>
                {index + 1}. {question.text} *
              </label>
              <textarea
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder={question.placeholder}
                rows={3}
                required
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  fontSize: "1em", 
                  borderRadius: "4px", 
                  border: "1px solid #ccc",
                  resize: "vertical"
                }}
              />
              <small style={{ color: "#666" }}>
                Minimum 10 characters
              </small>
            </div>
          ))}
        </section>

        {/* Submit Buttons */}
        <div style={{ 
          marginTop: "30px", 
          display: "flex", 
          gap: "15px", 
          justifyContent: "center",
          borderTop: "1px solid #ddd",
          paddingTop: "20px"
        }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: "12px 30px",
                fontSize: "1.1em",
                backgroundColor: "#f5f5f5",
                color: "#333",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 40px",
              fontSize: "1.1em",
              backgroundColor: loading ? "#ccc" : "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold"
            }}
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
      </form>

      <footer style={{ marginTop: "30px", textAlign: "center", color: "#666", fontSize: "0.9em" }}>
        <p>By submitting this form, you agree to our terms and conditions.</p>
      </footer>
    </div>
  );
}

export default VendorRegister;
