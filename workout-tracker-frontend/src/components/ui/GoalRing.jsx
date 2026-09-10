export default function GoalRing({ value, goal, caption = "sessions" }) {
  const pct = goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;
  const done = goal > 0 && value >= goal;
  return (
    <div
      className={`goal-ring ${done ? "done" : ""}`}
      style={{ "--pct": pct }}
      role="img"
      aria-label={`${value} of ${goal} ${caption} this week`}
    >
      <div className="goal-ring-inner">
        <span className="goal-ring-value">
          {value}
          <span className="goal-ring-goal">/{goal}</span>
        </span>
        <span className="goal-ring-cap">{caption}</span>
      </div>
    </div>
  );
}
