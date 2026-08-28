import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchCatalog } from "../api/catalog";
import { saveWorkout } from "../api/workouts";
import PageHeader from "./ui/PageHeader";
import LabeledField from "./ui/LabeledField";
import SectionCard from "./ui/SectionCard";

const MUSCLES = ["", "Chest", "Back", "Shoulders", "Legs", "Hamstrings", "Glutes", "Quads", "Calves", "Biceps", "Triceps", "Core", "Rear delts", "Posterior", "Full body"];

function emptySets(count, reps, weight) {
  return Array.from({ length: count }, (_, i) => ({
    setNumber: i + 1,
    reps,
    weight,
    failed: false,
  }));
}

export default function PlanPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("Training day");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState("");
  const [catalog, setCatalog] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    searchCatalog(query, muscle).then(setCatalog).catch(() => setCatalog([]));
  }, [query, muscle]);

  const addFromCatalog = (item) => {
    setExercises((prev) => [
      ...prev,
      {
        catalogId: item.id,
        name: item.name,
        muscleGroup: item.muscleGroup,
        targetSets: 3,
        targetReps: 8,
        targetWeight: 0,
        sets: emptySets(3, 8, 0),
      },
    ]);
  };

  const updateExercise = (index, field, value) => {
    setExercises((prev) => {
      const next = [...prev];
      const ex = { ...next[index], [field]: value };
      if (field === "targetSets" || field === "targetReps" || field === "targetWeight") {
        const sets = Number(ex.targetSets) || 0;
        ex.sets = emptySets(sets, Number(ex.targetReps) || 0, Number(ex.targetWeight) || 0);
      }
      next[index] = ex;
      return next;
    });
  };

  const save = async () => {
    setError("");
    if (exercises.length === 0) {
      setError("Add at least one lift from the library below.");
      return;
    }
    try {
      const saved = await saveWorkout({
        name,
        date,
        status: "PLANNED",
        exercises: exercises.map((ex, i) => ({
          catalogId: ex.catalogId,
          name: ex.name,
          sortOrder: i,
          targetSets: Number(ex.targetSets),
          targetReps: Number(ex.targetReps),
          targetWeight: Number(ex.targetWeight),
          sets: ex.sets,
        })),
      });
      navigate(`/session/${saved.id}`);
    } catch {
      setError("Could not save the plan.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Plan"
        subtitle="Pick lifts and set your targets. You'll log actual numbers during the session."
      />

      <LabeledField label="Session name" id="plan-name">
        <input
          id="plan-name"
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Upper push"
        />
      </LabeledField>

      <LabeledField label="Date" id="plan-date">
        <input
          id="plan-date"
          className="field"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </LabeledField>

      <p className="section-label">Exercise library</p>

      <div className="row">
        <LabeledField label="Search" id="plan-search" className="grow">
          <input
            id="plan-search"
            className="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bench, squat, row…"
          />
        </LabeledField>
        <LabeledField label="Muscle" id="plan-muscle" className="grow" style={{ minWidth: 140, flex: "0 0 140px" }}>
          <select id="plan-muscle" className="field" value={muscle} onChange={(e) => setMuscle(e.target.value)}>
            {MUSCLES.map((m) => (
              <option key={m || "all"} value={m}>
                {m || "All"}
              </option>
            ))}
          </select>
        </LabeledField>
      </div>

      {catalog.slice(0, 8).map((item) => (
        <button key={item.id} className="catalog-item" type="button" onClick={() => addFromCatalog(item)}>
          <span>
            <div className="catalog-item-name">{item.name}</div>
            <div className="muted">
              {item.muscleGroup} · {item.equipment}
            </div>
          </span>
          <span className="catalog-add">+ Add</span>
        </button>
      ))}

      {exercises.length > 0 && (
        <>
          <p className="section-label">Your plan ({exercises.length})</p>
          {exercises.map((ex, i) => (
            <SectionCard key={`${ex.catalogId}-${i}`} title={ex.name} subtitle={ex.muscleGroup}>
              <div className="field-row">
                <LabeledField label="Sets" id={`sets-${i}`}>
                  <input
                    id={`sets-${i}`}
                    className="field field-num"
                    type="number"
                    min="1"
                    value={ex.targetSets}
                    onChange={(e) => updateExercise(i, "targetSets", e.target.value)}
                  />
                </LabeledField>
                <LabeledField label="Reps" id={`reps-${i}`}>
                  <input
                    id={`reps-${i}`}
                    className="field field-num"
                    type="number"
                    min="1"
                    value={ex.targetReps}
                    onChange={(e) => updateExercise(i, "targetReps", e.target.value)}
                  />
                </LabeledField>
                <LabeledField label="Weight (kg)" id={`weight-${i}`}>
                  <input
                    id={`weight-${i}`}
                    className="field field-num"
                    type="number"
                    min="0"
                    value={ex.targetWeight}
                    onChange={(e) => updateExercise(i, "targetWeight", e.target.value)}
                  />
                </LabeledField>
              </div>
              <button
                className="btn danger"
                type="button"
                style={{ marginTop: "0.5rem" }}
                onClick={() => setExercises((prev) => prev.filter((_, idx) => idx !== i))}
              >
                Remove lift
              </button>
            </SectionCard>
          ))}
        </>
      )}

      {error && <p className="error">{error}</p>}

      <button className="btn btn-block" type="button" onClick={save} style={{ marginTop: "1rem" }}>
        Save plan & start logging
      </button>
    </div>
  );
}
