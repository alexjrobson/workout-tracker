const API_URL = "http://localhost:8080/api/workouts";

// Helper: get auth headers
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetch all workouts from backend
 * @returns Array of workouts or empty array on error
 */
export const getWorkouts = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: { ...authHeader() },
    });
    if (!response.ok) throw new Error("Failed to fetch workouts");
    return await response.json();
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }
};

export async function updateWorkout(id, workout) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(workout),
  });
  if (!response.ok) {
    throw new Error("Failed to update workout");
  }
  return await response.json();
}

export async function deleteWorkout(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!response.ok) {
    throw new Error("Failed to delete workout");
  }
  return true;
}

/**
 * Add a new workout to backend
 * @param {Object} workout - { name: string, date: "YYYY-MM-DD", exercises: [{name,reps,sets}] }
 * @returns Newly created workout or null on error
 */
export const addWorkout = async (workout) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(workout),
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`Failed to add workout: ${errMsg}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding workout:", error);
    return null;
  }
};

