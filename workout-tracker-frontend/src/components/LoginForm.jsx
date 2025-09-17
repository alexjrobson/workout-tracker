import React, { useState } from "react";
import { login, signup } from "../api/auth";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      onLogin(); // tell App that login was successful
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(username, password);
      await login(username, password);
      onLogin();
    } catch (err) {
      setError("Signup failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login / Signup</h2>
      <form>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignup} style={{ marginLeft: "0.5rem" }}>
          Signup
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginForm;