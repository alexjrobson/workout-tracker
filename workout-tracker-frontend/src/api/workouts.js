const API_URL = "/api/workouts";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parse(response) {
  if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(errMsg || "Request failed");
  }
  if (response.status === 204) return true;
  return response.json();
}

export async function getWorkouts() {
  const response = await fetch(API_URL, { headers: { ...authHeader() } });
  return parse(response);
}

export async function getWorkout(id) {
  const response = await fetch(`${API_URL}/${id}`, { headers: { ...authHeader() } });
  return parse(response);
}

export async function saveWorkout(workout, id) {
  const response = await fetch(id ? `${API_URL}/${id}` : API_URL, {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(workout),
  });
  return parse(response);
}

export async function deleteWorkout(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  return parse(response);
}
