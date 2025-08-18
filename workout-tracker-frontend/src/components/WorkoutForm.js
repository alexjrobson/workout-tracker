import React, { useState } from "react";
import { addWorkout, getWorkouts } from './api/workouts';
import { useState, useEffect } from 'react';

function WorkoutForm() {
  const [workouts, setWorkouts] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    getWorkouts().then(setWorkouts);
  }, []);

  const handleAdd = async () => {
    const newWorkout = { name };  // adapt fields to match your Java model
    const created = await addWorkout(newWorkout);
    if (created) setWorkouts([...workouts, created]);
    setName('');
  };

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Workout name" />
      <button onClick={handleAdd}>Add Workout</button>

      <ul>
        {workouts.map(w => (
          <li key={w.id}>{w.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default WorkoutForm;

