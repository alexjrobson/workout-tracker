import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getWorkout, saveWorkout } from "../api/workouts";
import PageHeader from "./ui/PageHeader";
import SectionCard from "./ui/SectionCard";
import { formatTarget, rpeDescription } from "../utils/format";

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getWorkout(id)
      .then(setWorkout)
      .catch(() => setError("Workout not found"));
  }, [id]);

  const updateSet = (exIndex, setIndex, field, value) => {
    setWorkout((prev) => {
      const next = { ...prev, exercises: prev.exercises.map((ex) => ({ ...ex, sets: [...ex.sets] })) };
      next.exercises[exIndex].sets[setIndex] = {
        ...next.exercises[exIndex].sets[setIndex],
        [field]: value,
      };
      return next;
    });
  };

  const persist = async (complete) => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: workout.name,
        date: workout.date,
        status: complete ? "COMPLETED" : workout.status,
        sessionRpe: workout.sessionRpe ?? 5,
        notes: workout.notes,
        exercises: workout.exercises.map((ex, i) => ({
          catalogId: ex.catalogId,
          name: ex.name,
          sortOrder: i,
          targetSets: ex.targetSets,
          targetReps: ex.targetReps,
          targetWeight: ex.targetWeight,
          sets: ex.sets.map((s, n) => ({
            setNumber: s.setNumber || n + 1,
            reps: Number(s.reps) || 0,
            weight: Number(s.weight) || 0,
            failed: Boolean(s.failed),
          })),
        })),
      };
      await saveWorkout(payload, workout.id);
      navigate(complete ? "/history" : "/");
    } catch {
      setError("Could not save session.");
    } finally {
      setSaving(false);
    }
  };

  if (!workout) {
    return <p className="muted">{error || "Loading…"}</p>;
  }

  const rpe = workout.sessionRpe || 5;

  return (
    <div>
      <PageHeader
        title={workout.name}
        subtitle={`${workout.date} · Log each set, then rate how the session felt.`}
      />

      {workout.exercises?.map((ex, exIndex) => (
        <SectionCard
          key={ex.id || exIndex}
          title={ex.name}
          subtitle={`Goal: ${formatTarget(ex.targetSets, ex.targetReps, ex.targetWeight)}`}
        >
          <div className="set-table">
            <div className="set-table-head">
              <span>Set</span>
              <span>Weight (kg)</span>
              <span>Reps</span>
              <span>Result</span>
            </div>
            {ex.sets?.map((set, setIndex) => (
              <div className="set-row" key={set.id || setIndex}>
                <span className="set-num">{set.setNumber || setIndex + 1}</span>
                <input
                  className="field field-num"
                  type="number"
                  inputMode="decimal"
                  value={set.weight ?? ""}
                  onChange={(e) => updateSet(exIndex, setIndex, "weight", e.target.value)}
                  aria-label={`Set ${setIndex + 1} weight`}
                />
                <input
                  className="field field-num"
                  type="number"
                  inputMode="numeric"
                  value={set.reps ?? ""}
                  onChange={(e) => updateSet(exIndex, setIndex, "reps", e.target.value)}
                  aria-label={`Set ${setIndex + 1} reps`}
                />
                <button
                  type="button"
                  className={`fail ${set.failed ? "on" : ""}`}
                  onClick={() => updateSet(exIndex, setIndex, "failed", !set.failed)}
                  aria-pressed={set.failed}
                >
                  {set.failed ? "Miss" : "Made"}
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}

      <SectionCard
        title="How did it feel?"
        subtitle="Rate the whole session from 1 (easy) to 10 (max effort)."
      >
        <div className="rpe-block">
          <div className="rpe-display">
            <span className="rpe-number">{rpe}</span>
            <span className="rpe-desc">{rpeDescription(rpe)}</span>
          </div>
          <input
            className="range"
            type="range"
            min="1"
            max="10"
            value={rpe}
            onChange={(e) => setWorkout({ ...workout, sessionRpe: Number(e.target.value) })}
            aria-label="Session RPE"
          />
          <div className="range-labels">
            <span>1 Easy</span>
            <span>5 Moderate</span>
            <span>10 Max</span>
          </div>
          <label className="field-group">
            <span className="field-label">Notes (optional)</span>
            <textarea
              className="field"
              rows={3}
              placeholder="Sleep, energy, pain, what to change next time…"
              value={workout.notes || ""}
              onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
            />
          </label>
        </div>
      </SectionCard>

      {error && <p className="error">{error}</p>}

      <div className="action-bar">
        <button className="btn secondary" type="button" disabled={saving} onClick={() => persist(false)}>
          Save & exit
        </button>
        <button className="btn" type="button" disabled={saving} onClick={() => persist(true)}>
          Finish session
        </button>
      </div>
      <p className="muted" style={{ marginTop: "0.75rem", fontSize: "0.78rem" }}>
        Save &amp; exit keeps it planned. Finish marks it complete so it counts toward progress.
      </p>
    </div>
  );
}
