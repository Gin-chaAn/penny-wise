export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-smoke/30 rounded-xl">
      <p className="font-display text-ivory tracking-wide mb-2">{title}</p>
      <p className="text-sm text-ash mb-5">{description}</p>
      {action}
    </div>
  );
}
