import React, { useState, useContext } from "react";
import { addWorkout, updateWorkout } from "../api/workouts";
import { AuthContext } from "../context/AuthContext";

function WorkoutForm({ onWorkoutSaved }) {
  const { token } = useContext(AuthContext); // ✅ use auth token
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", reps: 0, sets: 0, weight: 0, setError: false }
  ]);

  const resetForm = () => {
    setEditingWorkoutId(null);
    setName("");
    setExercises([{ name: "", reps: 0, sets: 0, weight: 0, setError: false }]);
  };

  const handleExerciseChange = (index, field, value) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "setError" ? value === "true" : value,
      };
      return updated;
    });
  };

  const addExerciseField = () => {
    setExercises([...exercises, { name: "", reps: 0, sets: 0, weight: 0, setError: false }]);
  };

  const removeExerciseField = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const workoutData = {
      name,
      date: new Date().toISOString().split("T")[0],
      exercises,
    };

    try {
      let saved;
      if (editingWorkoutId) {
        saved = await updateWorkout(editingWorkoutId, workoutData, token);
      } else {
        saved = await addWorkout(workoutData, token);
      }

      if (saved) {
        onWorkoutSaved(saved); // ✅ parent (WorkoutList) updates state
        resetForm();
      }
    } catch (err) {
      console.error("Failed to save workout:", err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem", fontFamily: "sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workout name"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        {exercises.map((ex, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              value={ex.name}
              onChange={(e) => handleExerciseChange(i, "name", e.target.value)}
              placeholder="Exercise"
              style={{ flex: 2, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="number"
              value={ex.reps}
              onChange={(e) => handleExerciseChange(i, "reps", parseInt(e.target.value))}
              placeholder="Reps"
              style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="number"
              value={ex.sets}
              onChange={(e) => handleExerciseChange(i, "sets", parseInt(e.target.value))}
              placeholder="Sets"
              style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="number"
              value={ex.weight}
              onChange={(e) => handleExerciseChange(i, "weight", parseInt(e.target.value))}
              placeholder="Weight"
              style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <select
              value={ex.setError}
              onChange={(e) => handleExerciseChange(i, "setError", e.target.value)}
              style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            >
              <option value={false}>✅ Completed</option>
              <option value={true}>❌ Failed</option>
            </select>
            <button type="button" onClick={() => removeExerciseField(i)} style={{ flex: 0.5 }}>
              ❌
            </button>
          </div>
        ))}

        <button type="button" onClick={addExerciseField} style={{ marginBottom: "1rem" }}>
          + Add Exercise
        </button>

        <button
          type="submit"
          style={{
            display: "block",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor: editingWorkoutId ? "#2196F3" : "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {editingWorkoutId ? "Update Workout" : "Add Workout"}
        </button>
      </form>
    </div>
  );
}

export default WorkoutForm;
