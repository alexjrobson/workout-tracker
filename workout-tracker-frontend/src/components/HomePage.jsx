import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkouts } from "../api/workouts";
import PageHeader from "./ui/PageHeader";
import MetricCard from "./ui/MetricCard";
import SectionCard from "./ui/SectionCard";
import { formatVolume } from "../utils/format";

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function HomePage() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getWorkouts()
      .then(setWorkouts)
      .catch(() => setError("Could not load workouts"));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const plannedToday = workouts.filter((w) => w.date === today && w.status === "PLANNED");
  const completed = workouts.filter((w) => w.status === "COMPLETED");

  const weekMetrics = useMemo(() => {
    const start = startOfWeek(new Date());
    const weekly = completed.filter((w) => new Date(w.date) >= start);
    const volume = weekly.reduce((sum, w) => sum + (w.volume || 0), 0);
    const failed = weekly.reduce((sum, w) => sum + (w.failedSets || 0), 0);
    const total = weekly.reduce((sum, w) => sum + (w.totalSets || 0), 0);
    const rpe =
      weekly.length === 0
        ? "—"
        : (
            weekly.reduce((sum, w) => sum + (w.sessionRpe || 0), 0) / weekly.length
          ).toFixed(1);
    return { volume, failed, total, rpe, sessions: weekly.length };
  }, [completed]);

  return (
    <div>
      <PageHeader
        title="Today"
        subtitle="Your planned session and this week's training load."
      />

      <div className="metrics">
        <MetricCard
          label="Volume"
          value={formatVolume(weekMetrics.volume)}
          unit="kg·reps"
          hint="Weight × reps, summed across all sets this week."
        />
        <MetricCard
          label="Avg effort"
          value={weekMetrics.rpe}
          unit="RPE"
          hint="Session RPE 1–10. How hard the week felt overall."
        />
        <MetricCard
          label="Missed sets"
          value={`${weekMetrics.failed}/${weekMetrics.total || 0}`}
          hint="Sets you marked as failed vs total logged."
        />
      </div>

      {error && <p className="error">{error}</p>}

      <p className="section-label">Today's session</p>

      {plannedToday.length === 0 ? (
        <SectionCard
          title="Nothing planned yet"
          subtitle="Build a workout from the exercise library, then log it when you're done."
        >
          <Link className="btn btn-block" to="/plan">
            Plan a workout
          </Link>
        </SectionCard>
      ) : (
        plannedToday.map((workout) => (
          <SectionCard
            key={workout.id}
            tag="Planned"
            tagVariant="planned"
            title={workout.name}
            subtitle={`${workout.exercises?.length || 0} lift${workout.exercises?.length === 1 ? "" : "s"} · tap to log sets`}
          >
            <Link className="btn btn-block" to={`/session/${workout.id}`}>
              Start logging
            </Link>
          </SectionCard>
        ))
      )}

      {completed[0] && (
        <>
          <p className="section-label">Last session</p>
          <SectionCard
            tag="Done"
            tagVariant="done"
            title={completed[0].name}
            subtitle={`RPE ${completed[0].sessionRpe ?? "—"} · ${formatVolume(completed[0].volume || 0)} kg·reps · ${completed[0].failedSets}/${completed[0].totalSets} missed`}
          />
        </>
      )}
    </div>
  );
}
