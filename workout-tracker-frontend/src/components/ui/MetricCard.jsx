export default function MetricCard({ label, value, unit, hint }) {
  return (
    <div className="metric" title={hint}>
      <span className="metric-label">{label}</span>
      <div className="metric-value-row">
        <strong className="metric-value">{value}</strong>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
      {hint && <p className="metric-hint">{hint}</p>}
    </div>
  );
}
