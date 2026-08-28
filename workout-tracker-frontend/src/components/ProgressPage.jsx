import { useEffect, useMemo, useState } from "react";
import { searchCatalog } from "../api/catalog";
import { getProgress } from "../api/progress";
import PageHeader from "./ui/PageHeader";
import SectionCard from "./ui/SectionCard";
import LabeledField from "./ui/LabeledField";
import { trendLabel } from "../utils/format";

export default function ProgressPage() {
  const [catalog, setCatalog] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    searchCatalog(query).then(setCatalog).catch(() => setCatalog([]));
  }, [query]);

  useEffect(() => {
    if (!selected) {
      setPoints([]);
      return;
    }
    getProgress(selected.id).then(setPoints).catch(() => setPoints([]));
  }, [selected]);

  const maxE1rm = useMemo(
    () => Math.max(1, ...points.map((p) => p.estimated1Rm || 0)),
    [points]
  );

  return (
    <div>
      <PageHeader
        title="Progress"
        subtitle="Track strength over time for a single lift. Only finished sessions count."
      />

      <LabeledField
        label="Choose a lift"
        hint="Estimated 1RM is calculated from your best set using the Epley formula."
        id="progress-search"
      >
        <input
          id="progress-search"
          className="field"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bench, squat, deadlift…"
        />
      </LabeledField>

      {!selected &&
        catalog.slice(0, 10).map((item) => (
          <button key={item.id} className="catalog-item" type="button" onClick={() => setSelected(item)}>
            <span>
              <div className="catalog-item-name">{item.name}</div>
              <div className="muted">{item.muscleGroup}</div>
            </span>
            <span className="catalog-add">View</span>
          </button>
        ))}

      {selected && (
        <SectionCard
          title={selected.name}
          subtitle={`${selected.muscleGroup} · ${points.length} session${points.length === 1 ? "" : "s"} logged`}
          actions={
            <button className="ghost" type="button" onClick={() => setSelected(null)}>
              Change
            </button>
          }
        >
          {points.length === 0 ? (
            <p className="muted">Complete a session with this lift to see progress here.</p>
          ) : (
            <>
              <p className="section-label" style={{ marginTop: 0 }}>
                Estimated 1RM trend
              </p>
              <div className="bars">
                {points.map((p) => (
                  <div key={p.workoutId} className="bar-wrap">
                    <div
                      className="bar"
                      title={`${p.date}: ${p.estimated1Rm} kg est. 1RM`}
                      style={{ height: `${(p.estimated1Rm / maxE1rm) * 100}%` }}
                    />
                    <span className="bar-label">{p.date.slice(5)}</span>
                  </div>
                ))}
              </div>

              <p className="section-label">Session log</p>
              {points.map((p) => (
                <div className="progress-row" key={p.workoutId}>
                  <span className="muted">{p.date}</span>
                  <span className="progress-lift">
                    {p.topWeight} kg × {p.topReps}
                  </span>
                  <span className="muted">Est. 1RM {p.estimated1Rm}</span>
                  <span className={`tag ${p.vsPrevious}`}>{trendLabel(p.vsPrevious)}</span>
                </div>
              ))}
            </>
          )}
        </SectionCard>
      )}
    </div>
  );
}
