import React, { useState, useEffect } from 'react';

// --- API FUNCTIONS ---
const API_URL = 'http://localhost:8080/workouts';

const getWorkouts = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch workouts');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

const addWorkout = async (workout) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout)
    });
    if (!res.ok) throw new Error('Failed to add workout');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// --- APP COMPONENT ---
function App() {
  const [workouts, setWorkouts] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    getWorkouts().then(setWorkouts);
  }, []);

  const handleAddWorkout = async () => {
    if (!name) return;
    const created = await addWorkout({ name }); // adapt fields to match your model
    if (created) setWorkouts([...workouts, created]);
    setName('');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Workout Tracker</h1>
      
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Workout name"
        style={{ padding: '0.5rem', marginRight: '1rem' }}
      />
      <button onClick={handleAddWorkout} style={{ padding: '0.5rem 1rem' }}>
        Add Workout
      </button>

      <ul style={{ marginTop: '2rem' }}>
        {workouts.map((w) => (
          <li key={w.id}>{w.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
