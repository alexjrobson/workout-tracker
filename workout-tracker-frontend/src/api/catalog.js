const API_URL = "/api/catalog/exercises";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function searchCatalog(q = "", muscleGroup = "") {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (muscleGroup) params.set("muscleGroup", muscleGroup);
  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: { ...authHeader() },
  });
  if (!response.ok) throw new Error("Failed to load catalog");
  return response.json();
}
