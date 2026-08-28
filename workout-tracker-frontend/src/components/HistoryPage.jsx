import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkouts } from "../api/workouts";
import PageHeader from "./ui/PageHeader";
import { formatVolume } from "../utils/format";

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    getWorkouts().then(setWorkouts).catch(() => setWorkouts([]));
  }, []);

  if (workouts.length === 0) {
    return (
      <div>
        <PageHeader title="History" subtitle="Completed and planned sessions appear here." />
        <p className="empty">No sessions yet. Plan one, log it, and finish the session.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="History"
        subtitle="Tap a session to review or continue logging."
      />
      {workouts.map((workout) => (
        <Link to={`/session/${workout.id}`} className="card history-link" key={workout.id}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: "0.35rem" }}>
            <h3>{workout.name}</h3>
            <span className={`tag ${workout.status === "COMPLETED" ? "done" : "planned"}`}>
              {workout.status === "COMPLETED" ? "Done" : "Planned"}
            </span>
          </div>
          <p className="muted">{workout.date}</p>
          <p className="muted">
            Effort RPE {workout.sessionRpe ?? "—"}
            {" · "}
            Volume {formatVolume(workout.volume || 0)} kg·reps
            {" · "}
            Missed {workout.failedSets}/{workout.totalSets} sets
          </p>
        </Link>
      ))}
    </div>
  );
}
