const API_URL = "http://localhost:8080/api/auth";

export async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  // Store token in localStorage for later use
  localStorage.setItem("token", data.token);
  return data;
}

export async function signup(username, password) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  return await response.json();
}

export function logout() {
  localStorage.removeItem("token");
}
