import React from "react";

export default function WorkoutList({ workouts }) {
  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Workouts</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {workouts.map((w) => (
          <li
            key={w.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            <span>{w.name}</span>
            <span>
              {w.weight ? `${w.weight} kg` : '-'} / {w.reps ? `${w.reps} reps` : '-'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

