import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWorkouts } from "../api/workouts";
import { searchCatalog } from "../api/catalog";
import { useAuth } from "../context/AuthContext";
import MetricCard from "./ui/MetricCard";
import SectionCard from "./ui/SectionCard";
import GoalRing from "./ui/GoalRing";
import { formatVolume, rpeDescription } from "../utils/format";
import {
  weeklyStats,
  weekStreak,
  buildNextSession,
  recommendExercises,
} from "../utils/recommend";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function nextWeekISO() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
}

const directionChip = { up: "Add load", down: "Back off", hold: "Hold" };

export default function HomePage() {
  const navigate = useNavigate();
  const { username } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [error, setError] = useState("");
  const [goal, setGoal] = useState(
    () => Number(localStorage.getItem("weeklyGoal")) || 3
  );

  useEffect(() => {
    getWorkouts()
      .then(setWorkouts)
      .catch(() => setError("Could not load workouts"));
    searchCatalog("").then(setCatalog).catch(() => setCatalog([]));
  }, []);

  useEffect(() => {
    localStorage.setItem("weeklyGoal", String(goal));
  }, [goal]);

  const today = new Date().toISOString().split("T")[0];
  const plannedToday = workouts.filter(
    (w) => w.date === today && w.status === "PLANNED"
  );

  const thisWeek = useMemo(() => weeklyStats(workouts, 0), [workouts]);
  const lastWeek = useMemo(() => weeklyStats(workouts, 1), [workouts]);
  const streak = useMemo(() => weekStreak(workouts), [workouts]);
  const nextSession = useMemo(() => buildNextSession(workouts), [workouts]);
  const suggestions = useMemo(
    () => recommendExercises(workouts, catalog, 3),
    [workouts, catalog]
  );

  const volumeDelta = useMemo(() => {
    if (!lastWeek.volume) return null;
    const pct = Math.round(((thisWeek.volume - lastWeek.volume) / lastWeek.volume) * 100);
    return {
      label: `${pct > 0 ? "+" : ""}${pct}%`,
      dir: pct > 1 ? "up" : pct < -1 ? "down" : "flat",
    };
  }, [thisWeek.volume, lastWeek.volume]);

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const startFromNext = () => {
    if (!nextSession) return;
    navigate("/plan", {
      state: {
        prefill: {
          name: `Next: ${nextSession.basedOnName}`,
          date: nextWeekISO(),
          exercises: nextSession.exercises.map((ex) => ({
            catalogId: ex.catalogId,
            name: ex.name,
            muscleGroup: ex.muscleGroup,
            targetSets: ex.targetSets,
            targetReps: ex.targetReps,
            targetWeight: ex.targetWeight,
          })),
        },
      },
    });
  };

  const addSuggestion = (item) => {
    navigate("/plan", {
      state: {
        prefill: {
          exercises: [
            {
              catalogId: item.id,
              name: item.name,
              muscleGroup: item.muscleGroup,
              targetSets: 3,
              targetReps: 8,
              targetWeight: 0,
            },
          ],
        },
      },
    });
  };

  return (
    <div>
      <header className="greeting">
        <h1>
          {greeting()}
          {username ? `, ${username}` : ""}
        </h1>
        <p className="lede">{dateLabel}</p>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="week-panel card">
        <GoalRing value={thisWeek.sessions} goal={goal} />
        <div className="week-panel-body">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="section-label" style={{ margin: 0 }}>
              This week
            </span>
            {streak > 0 && (
              <span className="streak-pill">
                {streak}-week streak
              </span>
            )}
          </div>
          <p className="week-panel-line">
            {thisWeek.sessions >= goal
              ? "Weekly goal hit. Anything extra is a bonus."
              : `${goal - thisWeek.sessions} more session${
                  goal - thisWeek.sessions === 1 ? "" : "s"
                } to hit your goal.`}
          </p>
          <div className="goal-stepper">
            <span className="muted">Weekly goal</span>
            <button
              className="step"
              type="button"
              onClick={() => setGoal((g) => Math.max(1, g - 1))}
              aria-label="Lower weekly goal"
            >
              −
            </button>
            <strong>{goal}</strong>
            <button
              className="step"
              type="button"
              onClick={() => setGoal((g) => Math.min(14, g + 1))}
              aria-label="Raise weekly goal"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="metrics">
        <MetricCard
          label="Volume"
          value={formatVolume(thisWeek.volume)}
          unit="kg·reps"
          hint="Weight times reps across every set this week."
          delta={volumeDelta?.label}
          deltaDir={volumeDelta?.dir}
        />
        <MetricCard
          label="Avg effort"
          value={thisWeek.avgRpe ? thisWeek.avgRpe.toFixed(1) : "—"}
          unit="RPE"
          hint="Average session RPE this week."
        />
        <MetricCard
          label="Sessions"
          value={thisWeek.sessions}
          hint="Completed sessions this week."
        />
      </div>

      <p className="section-label">Recommended next session</p>
      {nextSession ? (
        <SectionCard
          title={`Next: ${nextSession.basedOnName}`}
          subtitle={
            nextSession.basedOnRpe
              ? `Building on your last session. It felt "${rpeDescription(
                  nextSession.basedOnRpe
                ).toLowerCase()}".`
              : "Building on your last session."
          }
        >
          <div className="rec-list">
            {nextSession.exercises.map((ex, i) => (
              <div className="rec-row" key={`${ex.catalogId ?? ex.name}-${i}`}>
                <div className="rec-main">
                  <span className="rec-name">{ex.name}</span>
                  <span className={`chip ${ex.direction}`}>
                    {directionChip[ex.direction]}
                  </span>
                </div>
                <div className="rec-meta muted">
                  {ex.lastWeight > 0 ? (
                    <>
                      {ex.lastWeight}
                      <span className="rec-arrow"> → </span>
                      <strong className="rec-target">{ex.targetWeight} kg</strong>
                      {" · "}
                      {ex.targetSets} × {ex.targetReps}
                    </>
                  ) : (
                    <>
                      {ex.targetSets} × {ex.targetReps} · log your weight
                    </>
                  )}
                </div>
                <div className="rec-reason muted">{ex.reason}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-block" type="button" onClick={startFromNext} style={{ marginTop: "0.9rem" }}>
            Review &amp; start this plan
          </button>
        </SectionCard>
      ) : (
        <SectionCard
          title="No recommendation yet"
          subtitle="Finish a session and I'll build your next one from how it felt and the weights you used."
        >
          <Link className="btn btn-block" to="/plan">
            Plan your first workout
          </Link>
        </SectionCard>
      )}

      {suggestions.items.length > 0 && (
        <>
          <p className="section-label">Try something new</p>
          <SectionCard title="Recommended lifts" subtitle={suggestions.reason}>
            {suggestions.items.map((item) => (
              <button
                key={item.id}
                className="catalog-item"
                type="button"
                onClick={() => addSuggestion(item)}
              >
                <span>
                  <div className="catalog-item-name">{item.name}</div>
                  <div className="muted">
                    {item.muscleGroup} · {item.equipment}
                  </div>
                </span>
                <span className="catalog-add">+ Add</span>
              </button>
            ))}
          </SectionCard>
        </>
      )}

      <p className="section-label">Today</p>
      {plannedToday.length === 0 ? (
        <SectionCard
          title="Nothing planned for today"
          subtitle="Start from the recommendation above, or build something fresh."
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
            subtitle={`${workout.exercises?.length || 0} lift${
              workout.exercises?.length === 1 ? "" : "s"
            } · tap to log sets`}
          >
            <Link className="btn btn-block" to={`/session/${workout.id}`}>
              Start logging
            </Link>
          </SectionCard>
        ))
      )}
    </div>
  );
}
