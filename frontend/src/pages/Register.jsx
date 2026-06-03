import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    

    try {
      const response = await api.post("/auth/signup", formData);

      toast.success("Account created successfully");

      console.log(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div>
          <h1>Create Your Account</h1>

          <p>
            Join thousands of readers discovering their next favourite book.
          </p>

          <div className="quote-card">
            <h3>“A reader lives a thousand lives.”</h3>

            <span>George R. R. Martin</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-card">
          <h2>Register</h2>

          <p>Access your account</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?
            <a href="/login">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
