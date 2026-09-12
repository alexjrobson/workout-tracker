function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProgress(catalogId) {
  const response = await fetch(`/api/progress?catalogId=${catalogId}`, {
    headers: { ...authHeader() },
  });
  if (!response.ok) throw new Error("Failed to load progress");
  return response.json();
}
