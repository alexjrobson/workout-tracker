export default function LabeledField({
  label,
  hint,
  id,
  className = "",
  style,
  children,
}) {
  return (
    <label className={`field-group ${className}`} htmlFor={id} style={style}>
      <span className="field-label">{label}</span>
      {hint && <span className="field-hint">{hint}</span>}
      {children}
    </label>
  );
}
