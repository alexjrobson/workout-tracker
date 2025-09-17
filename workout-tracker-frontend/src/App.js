import React, { useState, useEffect } from "react";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";
import LoginForm from "./components/LoginForm";
import { getWorkouts } from "./api/workouts";

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    if (isLoggedIn) {
      const fetchWorkouts = async () => {
        const data = await getWorkouts();
        setWorkouts(data);
      };
      fetchWorkouts();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Workout Tracker</h1>
      <WorkoutForm workouts={workouts} setWorkouts={setWorkouts} />
      <WorkoutList workouts={workouts} />
    </div>
  );
}

export default App;