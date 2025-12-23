import { useState } from "react";
import { GraduationCap, User, ShieldCheck } from "lucide-react";
import "./Login.css";

function Login({ onLogin }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // 🔗 Call your backend API
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Success → pass user to parent
      onLogin(data.user);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-header">
          <GraduationCap size={48} />
          <h2>Welcome Back</h2>
          <p>Log in to access your portal</p>
        </div>

        <div className="login-body">
          {/* Toggle */}
          <div className="toggle">
            <button
              className={role === "student" ? "active" : ""}
              onClick={() => setRole("student")}
              type="button"
            >
              <User size={16} /> Student
            </button>
            <button
              className={role === "admin" ? "active" : ""}
              onClick={() => setRole("admin")}
              type="button"
            >
              <ShieldCheck size={16} /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder={
                role === "admin"
                  ? "admin@college.edu"
                  : "student@college.edu"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Error Message */}
            {error && <div className="error-msg">{error}</div>}

            <button className="login-btn" type="submit" disabled={loading}>
              {loading
                ? "Signing in..."
                : `Sign in as ${role === "admin" ? "Admin" : "Student"}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
