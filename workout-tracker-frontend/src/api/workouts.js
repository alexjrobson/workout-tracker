const API_URL = "http://localhost:8080/api/workouts";

export const addWorkout = async (workout) => {
  try {
    // Match your backend API URL
    const response = await fetch('http://localhost:8080/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout)
    });

    if (!response.ok) {
      throw new Error('Failed to add workout');
    }

    const createdWorkout = await response.json();
    return createdWorkout;  // return the newly created workout to update state
  } catch (error) {
    console.error('Error adding workout:', error);
    return null;
  }
};

export const getWorkouts = async () => {
  try {
    const response = await fetch('http://localhost:8080/workouts');
    if (!response.ok) throw new Error('Failed to fetch workouts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
};
