import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      const response = await api.post("/auth/login", formData);

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div>
          <h1>Welcome Back</h1>

          <p>Continue your reading journey with BookStore.</p>

          <div className="quote-card">
            <h3>“A reader lives a thousand lives.”</h3>

            <span>George R. R. Martin</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-card">
          <h2>Login</h2>

          <p>Access your account</p>

          <form onSubmit={handleSubmit}>
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
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          <div className="auth-switch">
            New here?
            <a href="/register">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
