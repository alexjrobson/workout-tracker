import { useState } from "react";
import { login as loginRequest, signup as signupRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import LabeledField from "./ui/LabeledField";

export default function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (action) => {
    const name = username.trim();
    if (!name || !password) {
      setError("Enter a username and password.");
      return;
    }

    setError("");
    setBusy(true);
    try {
      const data =
        action === "signup"
          ? await signupRequest(name, password)
          : await loginRequest(name, password);
      login(data.token);
    } catch {
      setError(
        action === "signup"
          ? "That username is already taken."
          : "Incorrect username or password."
      );
    } finally {
      setBusy(false);
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
        <form onSubmit={(e) => { e.preventDefault(); submit("login"); }}>
          <LabeledField label="Username" id="login-user">
            <input
              id="login-user"
              name="username"
              className="field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </LabeledField>
          <LabeledField label="Password" id="login-pass">
            <input
              id="login-pass"
              name="password"
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </LabeledField>
          <div className="row">
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Please wait…" : "Log in"}
            </button>
            <button
              className="btn secondary"
              type="button"
              disabled={busy}
              onClick={() => submit("signup")}
            >
              Create account
            </button>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
