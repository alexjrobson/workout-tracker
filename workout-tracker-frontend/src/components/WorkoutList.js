import React from "react";

export default function WorkoutList({ workouts }) {
  return (
    <div>
      <h2>Workouts</h2>
      <ul>
        {workouts.map((w) => (
          <li key={w.id}>
            {w.name} - {w.weight} kg - {w.reps} reps
          </li>
        ))}
      </ul>
    </div>
  );
}
