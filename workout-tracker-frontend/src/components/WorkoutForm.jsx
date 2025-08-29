import React, { useState, useEffect } from "react";
import { addWorkout, updateWorkout } from "../api/workouts";

function WorkoutForm({ workouts, setWorkouts }) {
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState([]);

  // Load workout into form for editing
  const loadWorkout = (workout) => {
    setEditingWorkoutId(workout.id);
    setName(workout.name);
    setExercises(workout.exercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      reps: ex.reps,
      sets: ex.sets,
      weight: ex.weight,
      setError: ex.setError
    })));
  };

  const resetForm = () => {
    setEditingWorkoutId(null);
    setName("");
    setExercises([{ name: "", reps: 0, sets: 0, weight: 0, setError: false }]);
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    if (field === "setError") value = value === "true"; // convert string to boolean
    updated[index][field] = value;
    setExercises(updated);
  };

  const addExerciseField = () => {
    setExercises([...exercises, { name: "", reps: 0, sets: 0, weight: 0, setError: false }]);
  };

  const removeExerciseField = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const workoutData = {
      name,
      date: new Date().toISOString().split("T")[0],
      exercises
    };

    if (editingWorkoutId) {
      // Update existing workout
      try {
        const saved = await updateWorkout(editingWorkoutId, workoutData);
        if (saved) {
          setWorkouts(workouts.map(w => (w.id === editingWorkoutId ? saved : w)));
        }
        resetForm();
      } catch (err) {
        console.error("Failed to update workout:", err);
      }
    } else {
      // Add new workout
      const created = await addWorkout(workoutData);
      if (created) setWorkouts([...workouts, created]);
      resetForm();
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

        <button type="submit" style={{ display: "block", padding: "0.5rem 1rem", borderRadius: "6px", backgroundColor: editingWorkoutId ? "#2196F3" : "#4CAF50", color: "white", border: "none", cursor: "pointer" }}>
          {editingWorkoutId ? "Update Workout" : "Add Workout"}
        </button>
      </form>

      <div>
        {workouts.map((w) => (
          <div key={w.id} style={{ border: "1px solid #eee", padding: "1rem", borderRadius: "6px", marginBottom: "1rem" }}>
            <h3>{w.name} - {w.date}</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {w.exercises.map((ex) => (
                <li key={ex.id} style={{ padding: "0.25rem 0" }}>
                  {ex.name}: {ex.sets} sets x {ex.reps} reps @ {ex.weight}kg {ex.setError ? "❌" : "✅"}
                </li>
              ))}
            </ul>
            <button onClick={() => loadWorkout(w)} style={{ padding: "0.3rem 0.6rem", borderRadius: "6px", backgroundColor: "#FFA500", color: "white", border: "none", cursor: "pointer" }}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutForm;
