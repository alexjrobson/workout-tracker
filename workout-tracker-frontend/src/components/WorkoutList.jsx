import React, { useState } from "react";
import { updateWorkout, deleteWorkout } from "../api/workouts";

export default function WorkoutList({ workouts, setWorkouts }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", date: "" });

  const handleEditClick = (workout) => {
    setEditingId(workout.id);
    setEditData({ name: workout.name, date: workout.date });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ name: "", date: "" });
  };

  const handleSave = async (id) => {
    try {
      const updated = await updateWorkout(id, editData);
      setWorkouts((prev) =>
        prev.map((w) => (w.id === id ? updated : w))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {workouts.length === 0 ? (
        <p style={{ textAlign: "center" }}>No workouts added yet.</p>
      ) : (
        workouts.map((workout) => (
          <div
            key={workout.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}
          >
            {editingId === workout.id ? (
              <>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) =>
                    setEditData({ ...editData, date: e.target.value })
                  }
                />
                <button onClick={() => handleSave(workout.id)}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <h3 style={{ margin: "0 0 0.5rem 0" }}>{workout.name}</h3>
                <p style={{ fontSize: "0.85rem", color: "#666" }}>
                  Date: {new Date(workout.date).toLocaleDateString()}
                </p>
                <button onClick={() => handleEditClick(workout)}>Edit</button>
                <button onClick={() => handleDelete(workout.id)}>Delete</button>
              </>
            )}

            {/* keep your exercises table below */}
            {workout.exercises && workout.exercises.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #ccc" }}>
                    <th style={{ textAlign: "left", padding: "0.25rem" }}>Exercise</th>
                    <th style={{ textAlign: "center", padding: "0.25rem" }}>Sets</th>
                    <th style={{ textAlign: "center", padding: "0.25rem" }}>Reps</th>
                    <th style={{ textAlign: "center", padding: "0.25rem" }}>Weight (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises.map((ex) => (
                    <tr key={ex.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "0.25rem" }}>{ex.name}</td>
                      <td style={{ textAlign: "center", padding: "0.25rem" }}>{ex.sets}</td>
                      <td style={{ textAlign: "center", padding: "0.25rem" }}>{ex.reps}</td>
                      <td style={{ textAlign: "center", padding: "0.25rem" }}>{ex.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "#999", marginTop: "0.5rem" }}>
                No exercises added yet.
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}




