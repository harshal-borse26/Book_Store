import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setMessage("Login successful");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
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

          <button
            type="submit"
            disabled={loading}
          >
            {
              loading
                ? "Logging In..."
                : "Login"
            }
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Login;