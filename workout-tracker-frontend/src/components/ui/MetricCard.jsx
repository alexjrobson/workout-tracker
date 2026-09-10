export default function MetricCard({ label, value, unit, hint, delta, deltaDir }) {
  return (
    <div className="metric" title={hint}>
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        {delta && <span className={`delta ${deltaDir || "flat"}`}>{delta}</span>}
      </div>
      <div className="metric-value-row">
        <strong className="metric-value">{value}</strong>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
    </div>
  );
}
