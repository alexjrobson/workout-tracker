import React, { useState, useEffect } from "react";
import { addWorkout, getWorkouts } from './api/workouts';

function WorkoutForm() {
  const [workouts, setWorkouts] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    getWorkouts().then(setWorkouts);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault(); // prevents page refresh
    if (!name.trim()) return;
   
   
    const newWorkout = { name };  // adapted fields to match Java model
    const created = await addWorkout(newWorkout);
    if (created) setWorkouts([...workouts, created]);
    setName('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Workout name"
          style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {workouts.map(w => (
          <li key={w.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
            {w.name}
          </li>
        ))}
      </ul>
      </div>
  );
}

export default WorkoutForm;

