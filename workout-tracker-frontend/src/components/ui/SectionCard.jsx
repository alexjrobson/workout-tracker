export default function SectionCard({ title, subtitle, tag, tagVariant, children, actions }) {
  const tagClass = tagVariant ? `tag ${tagVariant}` : "tag";
  return (
    <section className="card">
      {(title || tag) && (
        <div className="card-head">
          <div>
            {tag && <span className={tagClass}>{tag}</span>}
            {title && <h3>{title}</h3>}
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
