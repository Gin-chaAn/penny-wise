export default function Card({ children, className = "", elevated = false }) {
  return (
    <div
      className={`rounded-xl border border-smoke/20 ${elevated ? "bg-wine" : "bg-charcoal"} 
        p-5 shadow-[inset_0_1px_0_rgba(232,216,200,0.03)] animate-rise ${className}`}
    >
      {children}
    </div>
  );
}
