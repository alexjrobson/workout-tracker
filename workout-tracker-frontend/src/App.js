import React, { useState, useEffect } from "react";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";
import { getWorkouts } from "./api/workouts";

function App() {
  const [workouts, setWorkouts] = useState([]);

  // Fetch workouts from backend on component mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      const data = await getWorkouts();
      setWorkouts(data);
    };
    fetchWorkouts();
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Workout Tracker</h1>

      {/* Workout Form */}
      <WorkoutForm workouts={workouts} setWorkouts={setWorkouts} />

      {/* Workout List */}
      <WorkoutList workouts={workouts} />
    </div>
  );
}

export default App;


