import { useState } from "react";
import { login as loginRequest, signup as signupRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import LabeledField from "./ui/LabeledField";

export default function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginRequest(username, password);
      login(data.token);
    } catch {
      setError("Invalid credentials");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await signupRequest(username, password);
      login(data.token);
    } catch {
      setError("Signup failed — username may already exist");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand" style={{ marginBottom: "0.75rem" }}>
          Iron Log
        </div>
        <h1>Train with intent</h1>
        <p className="lede">Plan lifts, log sets, track strength over time.</p>
        <form>
          <LabeledField label="Username" id="login-user">
            <input
              id="login-user"
              className="field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </LabeledField>
          <LabeledField label="Password" id="login-pass">
            <input
              id="login-pass"
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </LabeledField>
          <div className="row">
            <button className="btn" type="button" onClick={handleLogin}>
              Log in
            </button>
            <button className="btn secondary" type="button" onClick={handleSignup}>
              Create account
            </button>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
